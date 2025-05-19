import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class FingerprintRegistrationPage extends StatefulWidget {
  final String doctorId;
  const FingerprintRegistrationPage({super.key, required this.doctorId});

  @override
  State<FingerprintRegistrationPage> createState() =>
      _FingerprintRegistrationPageState();
}

class _FingerprintRegistrationPageState
    extends State<FingerprintRegistrationPage> {
  final LocalAuthentication _auth = LocalAuthentication();
  String _status = "Ready to register fingerprint";
  bool _isRegistering = false;
  String? _deviceId;

  @override
  void initState() {
    super.initState();
    _getDeviceId();
  }

  Future<void> _getDeviceId() async {
    // In a real app, you'd get a unique device identifier
    _deviceId = "device_${DateTime.now().millisecondsSinceEpoch}";
  }

  Future<void> _registerFingerprint() async {
    if (_isRegistering || _deviceId == null) return;

    setState(() {
      _isRegistering = true;
      _status = "Scan your fingerprint to register...";
    });

    try {
      final bool didAuthenticate = await _auth.authenticate(
        localizedReason: 'Register your fingerprint',
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );

      if (didAuthenticate) {
        // In a real app, you would capture the fingerprint template here
        // For demo, we'll use a simulated template
        final fingerprintTemplate =
            "simulated_template_${DateTime.now().millisecondsSinceEpoch}";

        await _sendFingerprintToServer(fingerprintTemplate);

        setState(() {
          _status = "Fingerprint registered successfully!";
        });

        Navigator.pop(context, true); // Return success
      } else {
        setState(() {
          _status = "Fingerprint registration cancelled";
        });
      }
    } catch (e) {
      setState(() {
        _status = "Error: ${e.toString()}";
      });
    } finally {
      setState(() {
        _isRegistering = false;
      });
    }
  }

  Future<void> _sendFingerprintToServer(String template) async {
    final response = await http.post(
      Uri.parse("http://192.168.28.244:3002/api/register-fingerprint"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "doctorId": widget.doctorId,
        "fingerprintTemplate": template,
        "deviceIdentifier": _deviceId,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception("Failed to register fingerprint");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Register Fingerprint")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_status, textAlign: TextAlign.center),
            const SizedBox(height: 30),
            _isRegistering
                ? const CircularProgressIndicator()
                : ElevatedButton(
                  onPressed: _registerFingerprint,
                  child: const Text("Register Fingerprint"),
                ),
          ],
        ),
      ),
    );
  }
}
