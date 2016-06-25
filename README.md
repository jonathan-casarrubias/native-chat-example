Native Chat Application Example
==============

This is an example of the blog post [The Ultimate Guide For Building RTC Applications](http://mean.expert/2016/06/09/angular-2-ultimate-real-time);

## Install

```sh
$ git clone git@github.com:jonathan-casarrubias/native-chat-example.git
$ cd native-chat-api
$ npm install
$ ../native-chat-app
$ npm install
```

## Run Project

Open 2 terminal windows and start both... The API and App (use device or emulator, your choice)

Terminal 1:

```sh
$ cd native-chat-api
$ node .
RTC server listening at ws://0.0.0.0:3000/
Web server listening at: http://0.0.0.0:3000
Browse your REST API at http://0.0.0.0:3000/explorer
```

Terminal 2:

```sh
$ cd native-chat-app
$ tns run android
```

**IMPORTANT: Make sure to update the file: native-chat-app/app/shared/base.api.ts with your local network IP**
