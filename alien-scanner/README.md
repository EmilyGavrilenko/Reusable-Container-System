**Alien Reader Software** 
  1. Connect the Alien Reader to a WIFI router using the LAN port. The reader will now have a unique IP address.
  2. Open the alien-scanner folder in an IDE of choice, I used IntelliJ for development. 
  3. Run the NetworkDiscovery program and determine the `Reader Address` outputed by the program. 
  4. Update the readerAddress (line 14) in ConnectReader.java to the address returned in step 3
  5. Run AlienReaderCommunicator. If everything is set up properly, you'll be connected to the reader and can reprogram it. 
     Type in `help` or `info` to learn more about configuring the reader. 
  6. Update the computerAddress in TagStreamTest to your computer's ipv4 address. 
  7. Update the serverAddress in TagStreamTest to the backend server address from website/backend or the hosted website. 
      - Change `reader.setNotifyMode` (line 86) to `AlienClass1Reader.OFF` if you'd like to disable server communication.  
  8. Change resetReader to false if you'd like the server to continue running in the background after TagStreamTest finishes the 5 second test.
  9. Run TagStreamTest. Any tags located near the reader should output on the screen.
  10. Happy Coding!
  
