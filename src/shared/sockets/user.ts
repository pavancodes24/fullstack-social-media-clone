import { ILogin, ISocketData } from '@user/interfaces/user.interface';
import { Server, Socket } from 'socket.io';

export let socketIOUserObject: Server; // property of type server using it outside of the file
export const connectedUsersMap: Map<string, string> = new Map(); //map is like an object to set keys and values with map it remembers the order of the keys (unlike object and also has properties like has,set and delete)

let users: string[] = [];

export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }
  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('setup', (data: ILogin) => {
        this.addClientToMap(data.userId, socket.id); //socket.id created by socket io server //mistake? userId is the username.
        this.addUser(data.userId);
        this.io.emit('user online', users);
      });

      socket.on('block user', (data: ISocketData) => {
        //block user from client
        this.io.emit('blocked user id  ', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        //same as block user from the client listening
        this.io.emit('unblocked user id  ', data);
      });

      socket.on('disconnect', () => {
        this.removeClientFromMap(socket.id);
      });
    });
  }

  private addClientToMap(username: string, socketId: string): void {
    if (!connectedUsersMap.has(username)) {
      connectedUsersMap.set(username, socketId);
    }
  }
  private removeClientFromMap(socketId: string): void {
    if (Array.from(connectedUsersMap.values()).includes(socketId)) {
      const disconnectedUser: [string, string] = [...connectedUsersMap].find((user: [string, string]) => {
        return user[1] === socketId;
      }) as [string, string];
      connectedUsersMap.delete(disconnectedUser[0]);
      // send event to the client
      this.io.emit('user online', users);
    }
  }

  private addUser(username: string): void {
    users.push(username);
    //to remove duplicates
    users = [...new Set(users)];
  }

  private removeUser(username: string): void {
    users = users.filter((user: string) => user != username);
  }
}
