import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [showPassConf, setShowPassConf] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  

  const handleShowClick = () => setShowPass(!showPass);
  const handleConfirmShowClick = () => setShowPassConf(!showPassConf);

  const handlePhotoUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chatapp_upload"); // your upload preset
    data.append("cloud_name", "dzimjzumg"); // your cloud name

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzimjzumg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const cloudData = await res.json();

      if (cloudData.secure_url) {
        setPhoto(cloudData.secure_url);
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Upload failed");
      }
      setLoading(false);
    } catch (error) {
      console.error("Upload Error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload the image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    if (!name || !email || !pass || !confirmPass) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (pass !== confirmPass) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/backend/user",
        { name, email, password:pass, photo },
        config
      );

      toast({
        title: "Signed up successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data))

      setLoading(false)
    } catch(error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message, 
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);
    }

    console.log({ name, email, pass, confirmPass, photo });
  };

  return (
    <VStack spacing="15px">
      <FormControl id="name" isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowClick}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassConf ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleConfirmShowClick}>
              {showPassConf ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="photo">
        <FormLabel>Upload your profile photo</FormLabel>
        <Input type="file" p={1.5} onChange={handlePhotoUpload} />
        {photo && (
          <img
            src={photo}
            alt="Uploaded preview"
            style={{ width: "100px", marginTop: "10px", borderRadius: "5px" }}
          />
        )}
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
