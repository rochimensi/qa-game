# 2-players Q&A game with a Client-Server architecture

## Project motivation

Teleprocesses and Networks course at college, proposed to implement an app that uses a protocol over TCP sockets.

So here's the requested work: 

```
Client-server game of Q&A for 2 players.
```

## Game rules

The **goal** is to answer questions of particular subjects, with multiple choice options.

The **winner** is the player that gets most correct answers.

The player that connects first, will have to wait until the second one does too, before it can start answering questions.

When a player connects, he/she must provide first name.

## Settings

The **number of questions** to answer must be configurable.

Questions are stored on the server on a DB or file. 

Questions are grouped in **subjects**. 

Both questions and subjects should be configurable.

## Deliverables

1. Documented communication protocol.

    Protocol Messages and Syntax.

    Suggestion: States Machine Model.
    
    E.g.:
    
        Message : "Hello" . Parameter: First name of client to connect. Used at : Connection start.
        Response : "200" (OK)
        Description : The server waits for the connection of a client until a Hello message arrives from the client.
            
2. Source Code.

