
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>
#include <netdb.h>

#define MAX_BUF_SIZE 1024
void checkHostName(int hostname)
{
    if (hostname == -1)
    {
        perror("gethostname");
        exit(1);
    }
}
  
// Returns host information corresponding to host name
void checkHostEntry(struct hostent * hostentry)
{
    if (hostentry == NULL)
    {
        perror("gethostbyname");
        exit(1);
    }
}
  
// Converts space-delimited IPv4 addresses
// to dotted-decimal format
void checkIPbuffer(char *IPbuffer)
{
    if (NULL == IPbuffer)
    {
        perror("inet_ntoa");
        exit(1);
    }
}
  





int main(int argc, char *argv[]) {
	char hostbuffer[256];
    char *IPbuffer;
    struct hostent *host_entry;
    int hostname;
  
    // To retrieve hostname
    hostname = gethostname(hostbuffer, sizeof(hostbuffer));
    checkHostName(hostname);
  
    // To retrieve host information
    host_entry = gethostbyname(hostbuffer);
    checkHostEntry(host_entry);
  
    // To convert an Internet network
    // address into ASCII string
    IPbuffer = inet_ntoa(*((struct in_addr*)
                           host_entry->h_addr_list[0]));
  
 //from here
  int port_number, n,client_socket,server_socket;
  struct sockaddr_in server_address, client_address;
  socklen_t client_len;
  char buffer[MAX_BUF_SIZE];

  if (argc < 2) {
    fprintf(stderr,"ERROR, no port provided\n");
    exit(1);
  }
  server_socket = socket(AF_INET, SOCK_STREAM, 0);
  if (server_socket < 0) {
    perror("ERROR opening socket");
    exit(1);
  }
  memset((char *) &server_address, 0, sizeof(server_address));
  port_number = atoi(argv[1]);//convert character to interger atoi

  
  server_address.sin_family = AF_INET;
  inet_aton(IPbuffer, &server_address.sin_addr);//here change
  server_address.sin_port = htons(port_number);

  
  if (bind(server_socket, (struct sockaddr *) &server_address, sizeof(server_address)) < 0) {
    perror("ERROR on binding");
    exit(1);
  }

 
  listen(server_socket, 5);
  client_len = sizeof(client_address);

  
  client_socket = accept(server_socket, (struct sockaddr *) &client_address, &client_len);
  if (client_socket < 0) {
    perror("ERROR on accept");
    exit(1);
  }

  memset(buffer, 0, MAX_BUF_SIZE);
  n = read(client_socket, buffer, MAX_BUF_SIZE - 1);// read( , pointer to buffer, size of buffer);
  if (n < 0) {
    perror("ERROR reading from socket");
    exit(1);
  }


  FILE *file = fopen(buffer, "rb");//creates if there is no file
  if (file == NULL) {
    perror("ERROR opening file");
    exit(1);
  }


  while ((n = fread(buffer, 1, MAX_BUF_SIZE, file)) > 0) {  // no of full items successfully red
    if (send(client_socket, buffer, n, 0) < 0) {
      perror("ERROR sending file");
      exit(1);
    }
  }

  // Close the file and the socket
  fclose(file);
  close(client_socket);
  return 0;
  }
