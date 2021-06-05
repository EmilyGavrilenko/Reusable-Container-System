package com.alien;
import com.alien.enterpriseRFID.reader.*;

/**
 * Run the NetworkDiscovery program to determine the reader's address
 * Use the ipv4 address to connect to the reader
 *
 * The password by default will be password, change it afterwards for security purposes
 */

public class ConnectReader {

    public static AlienClass1Reader connect() throws AlienReaderException {
        String readerAddres = "192.168.50.95";
        AlienClass1Reader reader = new AlienClass1Reader(readerAddres);
        reader.setNetworkConnection(readerAddres, 23);
        reader.setUsername("alien");
        reader.setPassword("bloomarbl");
        reader.open();
        System.out.println("Successfully connected to the reader");
        return reader;
    }
}
