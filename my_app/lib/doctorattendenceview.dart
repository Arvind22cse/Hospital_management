import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DoctorAttendanceScreen extends StatefulWidget {
  final String doctorId;

  const DoctorAttendanceScreen({super.key, required this.doctorId});

  @override
  State<DoctorAttendanceScreen> createState() => _DoctorAttendanceScreenState();
}

class _DoctorAttendanceScreenState extends State<DoctorAttendanceScreen> {
  Future<List<Map<String, dynamic>>> fetchAttendanceData() async {
    final url = 'http://192.168.28.244:3002/api/getatten/${widget.doctorId}';
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((e) => e as Map<String, dynamic>).toList();
    } else {
      throw Exception('Failed to load attendance data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text(
          'Doctor Attendance',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: fetchAttendanceData(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text('Error fetching attendance data'));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No attendance records available'));
          }

          final attendanceData = snapshot.data!;

          return ListView.builder(
            itemCount: attendanceData.length,
            itemBuilder: (context, index) {
              final record = attendanceData[index];
              final checkInTime = DateTime.parse(record['check_in']);
              final checkOutTime =
                  record['check_out'] != null
                      ? DateTime.parse(record['check_out'])
                      : null;
              final date = record['date'];

              return ListTile(
                title: Text('Attendance on $date'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Check-in: ${checkInTime.toLocal()}'),
                    if (checkOutTime != null)
                      Text('Check-out: ${checkOutTime.toLocal()}'),
                  ],
                ),
                leading: const Icon(Icons.check_circle_outline),
              );
            },
          );
        },
      ),
    );
  }
}
