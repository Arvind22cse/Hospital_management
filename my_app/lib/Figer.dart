import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter/services.dart';
import 'package:local_auth_android/local_auth_android.dart';

class FingerprintAuthPage extends StatefulWidget {
  const FingerprintAuthPage({super.key});

  @override
  State<FingerprintAuthPage> createState() => _FingerprintAuthPageState();
}

class _FingerprintAuthPageState extends State<FingerprintAuthPage> {
  final LocalAuthentication auth = LocalAuthentication();
  String authStatus = "Initializing...";
  bool isAuthenticating = false;
  bool isAuthenticated = false;
  List<BiometricType> availableBiometrics = [];

  Future<void> checkBiometrics() async {
    try {
      setState(() {
        authStatus = "Checking biometric support...";
      });

      final bool isSupported = await auth.isDeviceSupported();
      final bool canCheck = await auth.canCheckBiometrics;
      availableBiometrics = await auth.getAvailableBiometrics();

      if (!mounted) return;

      setState(() {
        authStatus = """
Device Supported: $isSupported
Can Check Biometrics: $canCheck
Available Biometrics: ${availableBiometrics.join(', ')}
""";
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        authStatus = "Error checking biometrics: ${e.toString()}";
      });
    }
  }

  Future<void> authenticate() async {
    if (isAuthenticating) return;

    setState(() {
      isAuthenticating = true;
      authStatus = "Starting authentication...";
    });

    try {
      availableBiometrics = await auth.getAvailableBiometrics();

      final hasBiometric = availableBiometrics.isNotEmpty;

      if (!hasBiometric) {
        if (!mounted) return;
        setState(() {
          authStatus = "No biometric sensors available";
          isAuthenticating = false;
        });
        return;
      }

      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Verify your identity',
        authMessages: const <AuthMessages>[
          AndroidAuthMessages(
            signInTitle: 'Fingerprint Required',
            cancelButton: 'Cancel',
            biometricHint: 'Verify it\'s you',
            goToSettingsButton: 'Settings',
            goToSettingsDescription: 'Set up fingerprint authentication',
          ),
        ],
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
          useErrorDialogs: true,
        ),
      );

      if (!mounted) return;
      setState(() {
        isAuthenticated = didAuthenticate;
        authStatus =
            didAuthenticate
                ? "Authentication successful!"
                : "Authentication failed or was canceled";
        isAuthenticating = false;
      });
    } on PlatformException catch (e) {
      if (!mounted) return;
      setState(() {
        authStatus = """
Platform Exception: ${e.code}
${e.message}
Stack: ${e.stacktrace}
Available biometrics: ${availableBiometrics.join(', ')}
""";
        isAuthenticating = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        authStatus = "Unexpected error: ${e.toString()}";
        isAuthenticating = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    checkBiometrics();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Biometric Authentication")),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              Text(
                authStatus,
                style: const TextStyle(fontSize: 16, fontFamily: 'monospace'),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: isAuthenticating ? null : authenticate,
                    child: const Text("Authenticate"),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: checkBiometrics,
                    child: const Text("Refresh Status"),
                  ),
                ],
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed:
                    isAuthenticated
                        ? () => Navigator.pushNamed(context, '/location')
                        : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: isAuthenticated ? Colors.green : Colors.grey,
                ),
                child: const Text("Continue"),
              ),
              if (isAuthenticating)
                const Padding(
                  padding: EdgeInsets.only(top: 20),
                  child: CircularProgressIndicator(),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
