import 'package:flutter/material.dart';
import 'doctorattendenceview.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool _isScannerVisible = false;
  String doctorId = '';

  @override
  void initState() {
    super.initState();
    _getDoctorId();
  }

  Future<void> _getDoctorId() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      doctorId = prefs.getString('doctorId') ?? '';
    });
  }

  void _logout() {
    Navigator.pushReplacementNamed(context, '/login');
  }

  void _openProfile() {
    Navigator.pushNamed(context, '/profile');
  }

  void _openDoctorAttendance(String doctorId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => DoctorAttendanceScreen(doctorId: doctorId),
      ),
    );
  }

  // Method to navigate to the location page and pass doctorId
  void _getLocation() {
    Navigator.pushNamed(
      context,
      '/location',
      arguments: doctorId, // 👈 pass doctorId here
    );
  }

  // Method to mark attendance
  void _markAttendance() {
    Navigator.pushNamed(context, '/face', arguments: doctorId);
  }

  void _goBackFromScanner() {
    setState(() {
      _isScannerVisible = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F4F4),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.deepPurple,
        title: const Text("My App", style: TextStyle(color: Colors.white)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: PopupMenuButton<String>(
              offset: const Offset(0, 50),
              onSelected: (value) {
                if (value == 'logout') {
                  _logout();
                } else if (value == 'profile') {
                  _openProfile();
                } else if (value == 'attendance') {
                  _openDoctorAttendance(doctorId); // Pass doctorId here
                }
              },
              icon: const CircleAvatar(
                backgroundImage: NetworkImage(
                  'https://i.pravatar.cc/150?img=3',
                ),
              ),
              itemBuilder:
                  (BuildContext context) => [
                    const PopupMenuItem<String>(
                      value: 'profile',
                      child: Row(
                        children: [
                          Icon(Icons.person, color: Colors.deepPurple),
                          SizedBox(width: 8),
                          Text('Profile'),
                        ],
                      ),
                    ),
                    const PopupMenuItem<String>(
                      value: 'attendance',
                      child: Row(
                        children: [
                          Icon(Icons.event_available, color: Colors.deepPurple),
                          SizedBox(width: 8),
                          Text('Doctor Attendance'),
                        ],
                      ),
                    ),
                    const PopupMenuDivider(),
                    const PopupMenuItem<String>(
                      value: 'logout',
                      child: Row(
                        children: [
                          Icon(Icons.logout, color: Colors.deepPurple),
                          SizedBox(width: 8),
                          Text('Logout'),
                        ],
                      ),
                    ),
                  ],
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          Center(
            child:
                _isScannerVisible
                    ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Scan to Mark Attendance",
                          style: TextStyle(
                            fontSize: 22,
                            color: Colors.deepPurple,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 30),
                        Container(
                          width: 250,
                          height: 250,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: Colors.deepPurple,
                              width: 3,
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.qr_code_scanner,
                              size: 80,
                              color: Colors.deepPurple,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton.icon(
                          onPressed: _goBackFromScanner,
                          icon: const Icon(Icons.arrow_back),
                          label: const Text("Back"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.deepPurple,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ],
                    )
                    : Text(
                      "Good Morning Arvind!!!\n\n\n"
                      "Mark your presence",
                      style: Theme.of(
                        context,
                      ).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple,
                      ),
                      textAlign: TextAlign.center,
                    ),
          ),

          if (!_isScannerVisible)
            Positioned(
              bottom: 30,
              right: 90,
              child: ElevatedButton.icon(
                onPressed: _markAttendance,
                icon: const Icon(Icons.check_circle_outline),
                label: const Text("Mark Attendance"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  elevation: 5,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
