import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class LocationTracker extends StatefulWidget {
  const LocationTracker({super.key});

  @override
  _LocationTrackerState createState() => _LocationTrackerState();
}

class _LocationTrackerState extends State<LocationTracker> {
  String locationText = "Press the button to get location";
  bool isLoading = false;
  bool isSending = false;
  String? error;
  String? doctorId;

  @override
  void initState() {
    super.initState();
    _loadDoctorId();
  }

  // Fetch the doctorId from SharedPreferences
  Future<void> _loadDoctorId() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      doctorId = prefs.getString('doctorId');
    });
  }

  Future<void> getCurrentLocation() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() {
          error = "Location services are disabled. Please enable them.";
          locationText = "Could not get your location. Please try again.";
          isLoading = false;
        });
        return;
      }

      LocationPermission permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        setState(() {
          error = "Location permission denied. Please enable location access.";
          locationText = "Could not get your location. Please try again.";
          isLoading = false;
        });
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      double latitude = position.latitude;
      double longitude = position.longitude;

      final url = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse?lat=$latitude&lon=$longitude&format=json',
      );

      final response = await http.get(url, headers: {'User-Agent': 'my/1.0'});

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data != null && data['display_name'] != null) {
          setState(() {
            locationText = "Your current location:\n${data['display_name']}";
          });
        } else {
          setState(() {
            locationText =
                "Location found but address not determined.\nCoordinates: ${latitude.toStringAsFixed(6)}, ${longitude.toStringAsFixed(6)}";
          });
        }
      } else {
        setState(() {
          error = "Failed to fetch address from OpenStreetMap. Check internet.";
          locationText = "Could not get your location address.";
        });
      }
    } catch (e) {
      setState(() {
        error = "An error occurred: $e";
        locationText = "Could not get your location. Please try again.";
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> sendLocationToBackend() async {
    if (doctorId == null) {
      setState(() {
        error = "Doctor ID not found. Please login again.";
      });
      return;
    }

    if (locationText.startsWith("Your current location:")) {
      setState(() {
        isSending = true;
        error = null;
      });

      try {
        final response = await http.post(
          Uri.parse('http://192.168.28.244:3002/api/location'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'doctorId': doctorId, 'address': locationText}),
        );

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Location sent successfully!")),
          );
        } else {
          setState(() {
            error = "Failed to send data to the server.";
          });
        }
      } catch (e) {
        setState(() {
          error = "Error sending data: $e";
        });
      } finally {
        setState(() {
          isSending = false;
        });
      }
    } else {
      setState(() {
        error = "No valid location address to send.";
      });
    }
  }

  Future<void> markAttendance() async {
    if (doctorId == null) {
      setState(() {
        error = "Doctor ID not found. Please login again.";
      });
      return;
    }

    if (locationText.startsWith("Your current location:")) {
      setState(() {
        isSending = true;
        error = null;
      });

      try {
        final response = await http.post(
          Uri.parse('http://192.168.28.244:3002/api/attendance'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'doctorId': doctorId, 'address': locationText}),
        );

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Attendance marked successfully!")),
          );
        } else {
          setState(() {
            error = "Failed to mark attendance.";
          });
        }
      } catch (e) {
        setState(() {
          error = "Error marking attendance: $e";
        });
      } finally {
        setState(() {
          isSending = false;
        });
      }
    } else {
      setState(() {
        error = "No valid location address to mark attendance.";
      });
    }
  }

  Future<void> markCheckOut() async {
    if (doctorId == null) {
      setState(() {
        error = "Doctor ID not found. Please login again.";
      });
      return;
    }

    if (locationText.startsWith("Your current location:")) {
      setState(() {
        isSending = true;
        error = null;
      });

      try {
        final response = await http.post(
          Uri.parse(
            'http://192.168.28.244:3002/api/checkout',
          ), // Add your check-out API URL here
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'doctorId': doctorId, 'address': locationText}),
        );

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text("Check-out successful!")));
        } else {
          setState(() {
            error = "Failed to mark check-out.";
          });
        }
      } catch (e) {
        setState(() {
          error = "Error marking check-out: $e";
        });
      } finally {
        setState(() {
          isSending = false;
        });
      }
    } else {
      setState(() {
        error = "No valid location address to mark check-out.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Location Tracker")),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Card(
            elevation: 5,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "Location Tracker",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue,
                    ),
                  ),
                  SizedBox(height: 20),
                  Container(
                    padding: EdgeInsets.all(12),
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: Colors.blue.shade200),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      locationText,
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  if (error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        error!,
                        style: TextStyle(color: Colors.red, fontSize: 14),
                      ),
                    ),
                  SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: isLoading ? null : getCurrentLocation,
                    child:
                        isLoading
                            ? Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                                SizedBox(width: 10),
                                Text("Getting Location..."),
                              ],
                            )
                            : Text("Get Location Address"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                  SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: isSending ? null : sendLocationToBackend,
                    child:
                        isSending
                            ? Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                                SizedBox(width: 10),
                                Text("Sending..."),
                              ],
                            )
                            : Text("Send Data to Server"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                  SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: isSending ? null : markAttendance,
                    child:
                        isSending
                            ? Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                                SizedBox(width: 10),
                                Text("Marking Attendance..."),
                              ],
                            )
                            : Text("Mark Attendance"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                  SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: isSending ? null : markCheckOut,
                    child:
                        isSending
                            ? Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                                SizedBox(width: 10),
                                Text("Marking Check-Out..."),
                              ],
                            )
                            : Text("Mark Check-Out"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      padding: EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
