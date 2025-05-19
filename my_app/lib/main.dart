import 'package:flutter/material.dart';
import 'package:my_app/Camera.dart';
import 'login_page.dart';
import 'signup_page.dart';
import 'homepage.dart';
import 'location.dart';
import 'doctorattendenceview.dart';
import 'Figer.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart';
import 'dart:io';
import 'dart:convert';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.deepPurple),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const DoctorLoginPage(),
        '/signup': (context) => const DoctorSignupPage(),
        '/home': (context) => const Home(),
        '/finger': (context) => FingerprintAuthPage(),
        '/location': (context) => const LocationTracker(),
        '/face':
            (context) => FaceVerificationScreen(
              doctorId: ModalRoute.of(context)?.settings.arguments as String,
            ),
        '/attendence': (context) {
          final Map<String, dynamic> data =
              ModalRoute.of(context)?.settings.arguments
                  as Map<String, dynamic>? ??
              {};
          final String doctorId = data['doctorId'] ?? '';
          return DoctorAttendanceScreen(doctorId: doctorId);
        },
      },
    );
  }
}

// class FaceVerificationScreen extends StatefulWidget {
//   const FaceVerificationScreen({super.key});

//   @override
//   _FaceVerificationScreenState createState() => _FaceVerificationScreenState();
// }

// class _FaceVerificationScreenState extends State<FaceVerificationScreen> {
//   File? _image;
//   bool _isLoading = false;
//   String _result = '';
//   double _similarity = 0;
//   CameraController? _cameraController;
//   bool _isCameraReady = false;
//   bool _showCamera = false;

//   @override
//   void initState() {
//     super.initState();
//     _initializeCamera();
//   }

//   Future<void> _initializeCamera() async {
//     try {
//       final cameras = await availableCameras();
//       final firstCamera = cameras.firstWhere(
//         (camera) => camera.lensDirection == CameraLensDirection.front,
//         orElse: () => cameras.first,
//       );

//       _cameraController = CameraController(
//         firstCamera,
//         ResolutionPreset.medium,
//       );

//       await _cameraController!.initialize();
//       setState(() {
//         _isCameraReady = true;
//       });
//     } catch (e) {
//       debugPrint('Camera error: $e');
//     }
//   }

//   @override
//   void dispose() {
//     _cameraController?.dispose();
//     super.dispose();
//   }

//   Future<void> _pickImage() async {
//     final picker = ImagePicker();
//     final pickedFile = await picker.pickImage(source: ImageSource.gallery);

//     if (pickedFile != null) {
//       await _processImage(File(pickedFile.path));
//     }
//   }

//   Future<void> _takePicture() async {
//     if (!_isCameraReady || _cameraController == null) return;

//     try {
//       setState(() {
//         _isLoading = true;
//         _result = '';
//       });

//       await _cameraController!.takePicture().then((XFile file) async {
//         await _processImage(File(file.path));
//       });
//     } catch (e) {
//       debugPrint('Error taking picture: $e');
//       setState(() {
//         _isLoading = false;
//         _result = 'Error capturing image';
//       });
//     }
//   }

//   Future<void> _processImage(File imageFile) async {
//     setState(() {
//       _image = imageFile;
//       _isLoading = true;
//       _result = '';
//     });

//     try {
//       var request = http.MultipartRequest(
//         'POST',
//         Uri.parse('http://192.168.165.160:3002/face/verify-face'),
//       );

//       request.files.add(
//         await http.MultipartFile.fromPath('image', imageFile.path),
//       );

//       var response = await request.send();

//       if (response.statusCode == 200) {
//         final responseData = await response.stream.bytesToString();
//         final jsonData = json.decode(responseData);

//         setState(() {
//           _isLoading = false;
//           _result = jsonData['message'];
//           _similarity = jsonData['similarity']?.toDouble() ?? 0;
//         });
//       } else {
//         setState(() {
//           _isLoading = false;
//           _result = 'Error: ${response.statusCode}';
//         });
//       }
//     } catch (e) {
//       setState(() {
//         _isLoading = false;
//         _result = 'Error: $e';
//       });
//     }
//   }

//   void _toggleCamera() {
//     setState(() {
//       _showCamera = !_showCamera;
//       if (!_showCamera) {
//         _image = null;
//         _result = '';
//         _similarity = 0;
//       }
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text('Face Verification'),
//         actions: [
//           IconButton(
//             icon: Icon(_showCamera ? Icons.photo_library : Icons.camera_alt),
//             onPressed: _toggleCamera,
//           ),
//         ],
//       ),
//       body: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: <Widget>[
//           if (_showCamera && _isCameraReady)
//             Expanded(
//               child: Padding(
//                 padding: const EdgeInsets.all(8.0),
//                 child: AspectRatio(
//                   aspectRatio: _cameraController!.value.aspectRatio,
//                   child: CameraPreview(_cameraController!),
//                 ),
//               ),
//             )
//           else if (_image != null)
//             Expanded(
//               child: Padding(
//                 padding: const EdgeInsets.all(8.0),
//                 child: Image.file(_image!),
//               ),
//             )
//           else
//             Expanded(
//               child: Center(
//                 child: Text(
//                   _showCamera ? 'Camera not available' : 'No image selected',
//                   style: const TextStyle(fontSize: 18),
//                 ),
//               ),
//             ),
//           if (_isLoading)
//             const Padding(
//               padding: EdgeInsets.all(16.0),
//               child: CircularProgressIndicator(),
//             ),
//           if (_result.isNotEmpty)
//             Column(
//               children: [
//                 Text(
//                   _result,
//                   style: TextStyle(
//                     fontSize: 20,
//                     color: _result == 'Verified' ? Colors.green : Colors.red,
//                   ),
//                 ),
//                 if (_similarity > 0)
//                   Padding(
//                     padding: const EdgeInsets.only(top: 8.0),
//                     child: Text(
//                       'Similarity: ${_similarity.toStringAsFixed(2)}%',
//                       style: const TextStyle(fontSize: 16),
//                     ),
//                   ),
//               ],
//             ),
//           const SizedBox(height: 20),
//         ],
//       ),
//       floatingActionButton:
//           _showCamera && _isCameraReady
//               ? FloatingActionButton(
//                 onPressed: _takePicture,
//                 child: const Icon(Icons.camera),
//               )
//               : FloatingActionButton(
//                 onPressed: _pickImage,
//                 child: const Icon(Icons.photo_library),
//               ),
//     );
//   }
// }
