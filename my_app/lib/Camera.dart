import 'dart:convert';
import 'dart:io';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:camera/camera.dart';

class FaceVerificationScreen extends StatefulWidget {
  final String doctorId;

  const FaceVerificationScreen({Key? key, required this.doctorId})
    : super(key: key);

  @override
  _FaceVerificationScreenState createState() => _FaceVerificationScreenState();
}

class _FaceVerificationScreenState extends State<FaceVerificationScreen> {
  File? _image;
  bool _isLoading = false;
  String _result = '';
  double _similarity = 0;
  CameraController? _cameraController;
  bool _isCameraReady = false;
  bool _isScanning = false;
  Timer? _scanningTimer;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      final firstCamera = cameras.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => cameras.first,
      );

      _cameraController = CameraController(
        firstCamera,
        ResolutionPreset.medium,
      );

      await _cameraController!.initialize();
      setState(() {
        _isCameraReady = true;
      });
    } catch (e) {
      debugPrint('Camera error: $e');
      setState(() {
        _result = 'Camera initialization failed';
      });
    }
  }

  void _startScanning() {
    setState(() {
      _isScanning = true;
    });
    // Start capturing images every 2 seconds while scanning
    _scanningTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_isScanning) {
        _takePicture();
      } else {
        timer.cancel();
      }
    });
  }

  void _stopScanning() {
    setState(() {
      _isScanning = false;
    });
    _scanningTimer?.cancel();
  }

  @override
  void dispose() {
    _scanningTimer?.cancel();
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _takePicture() async {
    if (!_isCameraReady || _cameraController == null || _isLoading) return;

    setState(() {
      _isLoading = true;
      _result = '';
    });

    try {
      final XFile file = await _cameraController!.takePicture();
      await _processImage(File(file.path));
    } catch (e) {
      debugPrint('Error taking picture: $e');
      setState(() {
        _isLoading = false;
        _result = 'Error capturing image';
      });
    }
  }

  Future<void> _processImage(File imageFile) async {
    try {
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('http://192.168.28.244:3002/face/verify-face'),
      );

      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );

      var response = await request.send();

      if (response.statusCode == 200) {
        final responseData = await response.stream.bytesToString();
        final jsonData = json.decode(responseData);

        setState(() {
          _isLoading = false;
          _result =
              jsonData['message'] ??
              (jsonData['verified'] ? 'Verified' : 'Not Verified');
          _similarity = jsonData['similarity']?.toDouble() ?? 0;
        });

        if (jsonData['verified'] == true) {
          Navigator.pushReplacementNamed(
            context,
            '/location',
            arguments: widget.doctorId,
          );
        }
      } else {
        final errorData = await response.stream.bytesToString();
        final errorJson = json.decode(errorData);
        setState(() {
          _isLoading = false;
          _result = errorJson['error'] ?? 'Verification failed';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _result = 'Error: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Face Verification'),
        centerTitle: true,
        backgroundColor: Colors.blue[700],
        elevation: 0,
      ),
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      body: Stack(
        children: [
          // Camera Preview with reduced width
          if (_isCameraReady && _isScanning)
            Center(
              child: Container(
                width:
                    MediaQuery.of(context).size.width *
                    0.9, // 70% of screen width
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.blue[400]!, width: 2),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: const Color.fromARGB(
                        255,
                        255,
                        253,
                        253,
                      ).withOpacity(0.5),
                      blurRadius: 10,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: AspectRatio(
                  aspectRatio: _cameraController!.value.aspectRatio,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: CameraPreview(_cameraController!),
                  ),
                ),
              ),
            ),

          // Initial placeholder when not scanning
          if (!_isScanning)
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.face_retouching_natural,
                    size: 120,
                    color: Colors.blue[300],
                  ),
                  const SizedBox(height: 30),
                  const Text(
                    'Hold the button to scan your face',
                    style: TextStyle(
                      fontSize: 22,
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Make sure your face is well lit and centered',
                    style: TextStyle(fontSize: 16, color: Colors.grey[400]),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

          // Loading indicator
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                strokeWidth: 5,
              ),
            ),

          // Results and scan button
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Column(
              children: [
                // Verification result
                if (_result.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      color:
                          _result == 'Verified'
                              ? Colors.green.withOpacity(0.9)
                              : const Color.fromARGB(
                                255,
                                238,
                                238,
                                238,
                              ).withOpacity(0.9),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _result == 'Verified'
                              ? Icons.check_circle
                              : Icons.error,
                          color: const Color.fromARGB(255, 190, 1, 1),
                          size: 24,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          _result,
                          style: const TextStyle(
                            fontSize: 18,
                            color: Color.fromARGB(255, 168, 0, 0),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        // if (_similarity > 0) ...[
                        //   const SizedBox(width: 10),
                        //   Text(
                        //     '${_similarity.toStringAsFixed(1)}%',
                        //     style: const TextStyle(
                        //       fontSize: 16,
                        //       color: Colors.white,
                        //     ),
                        //   ),
                        // ],
                      ],
                    ),
                  ),

                // Scan button
                GestureDetector(
                  onTapDown: (_) => _startScanning(),
                  onTapUp: (_) => _stopScanning(),
                  onTapCancel: () => _stopScanning(),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: _isScanning ? 120 : 100,
                    height: _isScanning ? 120 : 100,
                    decoration: BoxDecoration(
                      color: _isScanning ? Colors.red : Colors.blue[700],
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.3),
                          blurRadius: 15,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Icon(
                      _isScanning ? Icons.stop : Icons.fingerprint,
                      size: _isScanning ? 50 : 40,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
