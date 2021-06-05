
package com.alien;

import com.alien.enterpriseRFID.reader.*;
import com.alien.enterpriseRFID.tags.*;
import com.sun.org.apache.xml.internal.dtm.ref.sax2dtm.SAX2DTM2;

import java.io.*;
import java.util.*;
import java.net.*;

public class Main {

    public Main() throws Exception {

        //Determine Startup info
        BufferedReader StartupInput = new BufferedReader(new InputStreamReader(System.in));
        String buffer = new String();
        //System.out.print("\nHow Many Total Readers?>");
        //buffer = StartupInput.readLine();
        //int Num_Readers = Integer.parseInt(buffer);
        System.out.print("\nHow Many Tags Per Box?>");
        buffer = StartupInput.readLine();
        int Num_Tags = Integer.parseInt(buffer);
        //System.out.print("\nConveyor Data Input Port?>");
        //buffer = StartupInput.readLine();
        //int InputPort = Integer.parseInt(buffer);
        //System.out.print("\nConveyor Data Output Port?>");
        //buffer = StartupInput.readLine();
        //int OutputPort = Integer.parseInt(buffer);
        
        // Open Data Storage File
        File datafile = new File("RFID Data Output.txt");
        File sortedfile = new File("RFID Sorted Output.txt");
        FileWriter RawData = new FileWriter(datafile);
        RawData.write("Tag ID, Portal, Reader, Antenna, Read Count, TimeStamp\n");
        FileWriter SortedData = new FileWriter(sortedfile);
        SortedData.write("Portal, Tag ID\n");

        // Open Communication Files
        BufferedWriter JavaOutWriter = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("JavaOut.txt")));
        int[] packetout = {1,0,0,1,0,0,0,0,4095};
        JavaOutWriter.write(String.valueOf(BuildPacket(packetout)));
        JavaOutWriter.close();
        BufferedReader JavaInReader = new BufferedReader(new InputStreamReader((new FileInputStream("JavaOut.txt"))));
        String packetinstring = JavaInReader.readLine();
        int packetinint = Integer.parseInt(packetinstring);
        int[] packetin = ParsePacket(packetinint);
        for (int i = 0; i<packetin.length; i++){
            System.out.println(packetin[i]);
        }
        JavaInReader.close();

        // Discover Readers (Future)


        AlienClass1Reader reader = ConnectReader.connect();

        // Socket Initialization

        // Socket for Data Coming From Conveyor
        //InputServer InputSocket = new InputServer(InputPort);
        //System.out.println("Input socket started on port: " + InputPort);

        // Socket for Data Going to the Conveyor
        //OutputServer OutputSocket = new OutputServer("127.0.0.1", OutputPort);
        //System.out.println("Output socket started on local host using port: " + OutputPort);

        //int[] PacketOut = {0, 0, 0, 0, 0, 0, 0, 0, 4095};
        //OutputSocket.SendPacket(BuildPacket(PacketOut));

        //int packet = InputSocket.ReceivePacket();
        //int[] ConveyorData = ParsePacket(packet);
        //System.out.println(ConveyorData);


        // User Input Initialization
        BufferedReader RunTimeInput = new BufferedReader(new InputStreamReader(System.in));
        String userinput = new String();
        boolean Portal1ReadingFinished = false;
        boolean Portal1Reading = false;

        System.out.print("\nThank you\nTo Quit:q\nPhoto-Eye 1 Trigger: 1\nPhoto-Eye 2 Trigger: 1\nPhoto-Eye 3 Trigger: 3\nPhoto-Eye 1 Trigger: 1\nMain...>");

        do {
            // Check for User Input
            if (System.in.available() == 0) {
            } else {
                userinput = RunTimeInput.readLine();
            }

            // Exit Program Loop
            if (userinput.equals("q")) break;

            // Check for Socket Input


            //Start reading Portal 1 if Eye 1 trig
            if (userinput.equals("1")) {
                reader.setAutoMode(1);
                System.out.println("\nPhoto-Eye 1 Triggered\nStarted Reading Data From Portal 1...");
                Portal1Reading = true;
                userinput = "0";
            }


            //Stop Reading Portal 1 if Eye 2 trig
            if (userinput.equals("2")) {
                if (Portal1Reading) {
                    reader.setAutoMode(0);
                    System.out.println("\nPhoto-Eye 2 Triggered\nStopped Reading Data Portal 1");
                    Portal1Reading = false;
                    Portal1ReadingFinished = true;
                    userinput = "0";
                } else {
                    System.out.println("\nPhotoEye 2 Triggered Before Photo Eye 1 Command Ignored");
                    userinput = "0";
                }
            }


            //Get Tags and Append to Data File
            if (Portal1ReadingFinished) {
                Tag[] taglist = reader.getTagList();
                reader.clearTagList();


                // Creating Unique Tag List
                List<String> UniqueTags = new ArrayList<>();

                if (taglist == null) {
                    RawData.write("Missed Read On Portal 1");
                } else {
                    for (int i = 0; i < taglist.length; i++) {
                        Tag temptag = taglist[i];
                        RawData.append(temptag.getTagID() +
                                ", " + reader.getReaderName() +
                                ", " + temptag.getAntenna() +
                                ", " + temptag.getRenewCount() +
                                ", " + temptag.getRenewTime() +
                                " \n"
                        );
                        if (!UniqueTags.contains(temptag.getTagID())) {
                            UniqueTags.add(temptag.getTagID());
                            SortedData.append("1, " + temptag.getTagID() + "\n");
                        }
                    }
                }
                Portal1ReadingFinished = false;
                System.out.println("Finished Writing Tags");
                if (UniqueTags.size() < Num_Tags) {
                    //...
                }
            }


        } while (true);


        //Shut Down Procedure

        // Close the connection
        reader.close();
        // Close File Writers
        RawData.close();
        SortedData.close();
        // Close Data Sockets

    }

    public static final void main(String args[]) {
        try {
            new Main();
        } catch (Exception e) {
            System.out.println("Error: " + e.toString());
        }
    }

    private class OutputServer {
        // initialize socket and input output streams
        private Socket socket = null;
        private DataOutputStream out = null;

        public OutputServer(String Address, int Port) {
            // establish a connection
            try {
                socket = new Socket(Address, Port);
                System.out.println("Output Server Connected");

                // sends output to the socket
                out = new DataOutputStream(socket.getOutputStream());
            } catch (UnknownHostException u) {
                System.out.println(u);
            } catch (IOException i) {
                System.out.println(i);
            }
        }

        // Send Packet
        public void SendPacket(int packet) {
            try {
                out.write(packet);
            } catch (IOException i) {
                System.out.println(i);
            }
        }

        // Close Connection
        public void close() {
            try {
                socket.close();
                out.close();
            } catch (IOException i) {
                System.out.println(i);
            }
        }
    }

    private class InputServer {
        // initialize socket and input output streams
        private Socket socket = null;
        private ServerSocket server = null;
        private DataInputStream in = null;

        public InputServer(int Port) {
            // establish a connection
            try {
                server = new ServerSocket(Port);
                System.out.println("Input Server Started");
                System.out.println("Waiting for a Conveyor Client...");
                socket = server.accept();
                System.out.println("Conveyor Client Accepted");
                in = new DataInputStream(socket.getInputStream());
            } catch (IOException i) {
                System.out.println(i);
            }
        }

        // Send Packet
        public int ReceivePacket() {
            int packet = -1;
            String packet2 = new String();
            try {
                //packet2 = in.read();
                packet = in.read();

            } catch (IOException i) {
                System.out.println(i);
            }
            return packet;
        }

        // Close Connection
        public void close() {
            try {
                socket.close();
                in.close();
            } catch (IOException i) {
                System.out.println(i);
            }
        }
    }

    private int BuildPacket(int[] in) {
        int out = 0;
        for (int i = 0; i < in.length-1; i++) {
            out = out + Math.multiplyExact(in[i],(int)Math.pow(2,19-i));
        }
        out = out + in[in.length-1];
        return out;
    }

    private int[] ParsePacket(int in) {
        int[] out = new int[9];
        for (int i = 0; i < out.length - 1; i++) {
            if (in - Math.pow(2, 19 - i) > 0) {
                out[i] = 1;
                double curentbinary = Math.pow(2, 19 - i);
                in = in - (int) curentbinary;
            } else {
                out[i] = 0;
            }
        }
        out[8] = in;
        return out;
    }

}
