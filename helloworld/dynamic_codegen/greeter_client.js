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

const parseArgs         = require('minimist');
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

function main() {

  // 接続先指定
  const argv   = parseArgs(process.argv.slice(2), { string: 'target' });
  const target = argv?.target ?? 'localhost:50051';
  const client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());

  const name      = (argv._.length > 0)? argv._[0]: 'world';
  const parameter = {name};
  const callback  = (err, response) => console.log('Greeting:', response.message);

  // gRPC Request
  client.sayHello      (parameter, callback);
  client.sayHelloAgain (parameter, callback);
  client.sayCountNumber({num: 11}, (err, response) => console.log(`Count: ${response.num}`));
}

main();
