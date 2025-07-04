import React from "react";
import { useState } from "react";
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

import axios from "axios";
import {useNavigate} from "react-router-dom";
import { ChatState } from "../../Contexts/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {setUser} = ChatState();

  const handleShowClick = () => setShowPass(!showPass);

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !pass) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/backend/user/login",
        { email, password: pass },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      

      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log("logged in user data: ", data);
      setUser(data);
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Error Occurred",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing="15px">
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

      <Button onClick={handleSubmit} colorScheme="blue" width="100%">
        Login
      </Button>
      <Button
        isLoading={loading}
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPass("1234567");
        }}
      >
        Guest user credentials
      </Button>
    </VStack>
  );
};

export default Login;
