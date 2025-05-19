import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'dart:convert';

import 'package:path_provider/path_provider.dart';

class DoctorSignupPage extends StatefulWidget {
  const DoctorSignupPage({super.key});

  @override
  State<DoctorSignupPage> createState() => _DoctorSignupPageState();
}

class _DoctorSignupPageState extends State<DoctorSignupPage> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final specializationController = TextEditingController();
  File? _selectedImage;

  Future<void> _pickImage() async {
    final pickedFile = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      // Add this line for better image handling
      imageQuality: 90,
      maxWidth: 800,
    );
    if (pickedFile != null) {
      final bytes = await pickedFile.readAsBytes();
      final tempDir = await getTemporaryDirectory();
      final file = File(
        '${tempDir.path}/${DateTime.now().millisecondsSinceEpoch}.jpg',
      );
      await file.writeAsBytes(bytes);

      setState(() {
        _selectedImage = file;
      });
    }
  }

  Future<void> registerDoctor() async {
    if (_selectedImage == null) return;

    try {
      final bytes = await _selectedImage!.readAsBytes();
      final base64Image = base64Encode(bytes);
      final ext = _selectedImage!.path.split('.').last.toLowerCase();

      final response = await http.post(
        Uri.parse("http://192.168.28.244:3002/api/add-doctor"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'doctor_name': nameController.text.trim(),
          'doctor_email': emailController.text.trim(),
          'password': passwordController.text.trim(),
          'phone': phoneController.text.trim(),
          'specialization': specializationController.text.trim(),
          'image': {'data': base64Image, 'extension': ext},
        }),
      );

      // Handle response
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const Text(
                  "Doctor Sign Up",
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),

                // Profile Picture Upload
                GestureDetector(
                  onTap: _pickImage,
                  child: Container(
                    height: 120,
                    width: 120,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(60),
                    ),
                    child:
                        _selectedImage == null
                            ? const Icon(
                              Icons.add_a_photo,
                              size: 40,
                              color: Colors.grey,
                            )
                            : ClipRRect(
                              borderRadius: BorderRadius.circular(60),
                              child: Image.file(
                                _selectedImage!,
                                fit: BoxFit.cover,
                              ),
                            ),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Upload Profile Picture',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),

                // Form Fields
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(
                    labelText: 'Phone',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: specializationController,
                  decoration: const InputDecoration(
                    labelText: 'Specialization',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 20),

                // Register Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: registerDoctor,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text(
                      "Register",
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  child: const Text("Already have an account? Login"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
