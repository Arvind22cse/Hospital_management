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
  Timer? _captureTimer;
  bool _verificationInProgress = false;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _startAutoCapture();
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

  void _startAutoCapture() {
    _captureTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (!_verificationInProgress && _isCameraReady) {
        _takePicture();
      }
    });
  }

  @override
  void dispose() {
    _captureTimer?.cancel();
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _takePicture() async {
    if (!_isCameraReady || _cameraController == null || _verificationInProgress)
      return;

    setState(() {
      _verificationInProgress = true;
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
        _verificationInProgress = false;
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
          _result = jsonData['message'];
          _similarity = jsonData['similarity']?.toDouble() ?? 0;
        });

        // Navigate to location screen if verification is successful
        // In _processImage method, replace the navigation code with:
        if (_result == 'Verified') {
          Navigator.pushReplacementNamed(
            context,
            '/location',
            arguments: widget.doctorId, // Just pass the doctorId directly
          );
        }
      } else {
        setState(() {
          _isLoading = false;
          _result = 'Error: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _result = 'Error: $e';
      });
    } finally {
      setState(() {
        _verificationInProgress = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Face Verification'), centerTitle: true),
      body: Stack(
        children: [
          if (_isCameraReady)
            Center(
              child: AspectRatio(
                aspectRatio: _cameraController!.value.aspectRatio,
                child: CameraPreview(_cameraController!),
              ),
            ),
          if (_isLoading) const Center(child: CircularProgressIndicator()),
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Column(
              children: [
                if (_result.isNotEmpty)
                  Text(
                    _result,
                    style: TextStyle(
                      fontSize: 20,
                      color: _result == 'Verified' ? Colors.green : Colors.red,
                    ),
                  ),
                if (_similarity > 0)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      'Similarity: ${_similarity.toStringAsFixed(2)}%',
                      style: const TextStyle(fontSize: 16, color: Colors.white),
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
