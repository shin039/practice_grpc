/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const PROTO_PATH = __dirname + '/../../protos/helloworld.proto';

const grpc              = require('@grpc/grpc-js');
const protoLoader       = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
const sayHello       = (call, callback) => callback(null, {message: 'Hello '        + call.request.name});
const sayHelloAgain  = (call, callback) => callback(null, {message: 'Hello again, ' + call.request.name});
const sayCountNumber = (call, callback) => callback(null, {num    : call.request.num });

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();

  // Add Service
  const services = {
    sayHello      : sayHello,
    sayHelloAgain : sayHelloAgain,
    sayCountNumber: sayCountNumber,
  }

  server.addService(hello_proto.Greeter.service, services);

  // Server Start
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => server.start() );
}

main();
