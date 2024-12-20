import gameService from "../services/gameService.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    const emitError = (message) => {
      socket.emit("error", { message });
    };

    socket.on("viewGames", async () => {
      try {
        const games = await gameService.viewGames();
        socket.emit("gamesList", games);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("createGame", async () => {
      try {
        const game = await gameService.createGame();
        io.emit("gameCreated", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("deleteGame", async (gameId) => {
      try {
        const game = await gameService.deleteGame(gameId);
        if (game) {
          io.emit("gameDeleted", gameId);
        } else {
          throw new Error("No se encontró el juego para eliminar");
        }
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("joinGame", async (gameId, userId) => {
      try {
        const game = await gameService.joinGame(gameId, userId);
        socket.join(gameId);
        socket.emit("gameJoined", game);

        io.emit("playerJoined", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("startGame", async (gameId) => {
      try {
        const game = await gameService.startGame(gameId);
        io.to(gameId).emit("gameStarted", game);

        io.emit("gameStartedAll", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("drawBall", async (gameId) => {
      try {
        const { newBall, game } = await gameService.drawBall(gameId);
        io.to(gameId).emit("ballDrawn", { newBall, game });
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("markBall", async (gameId, userId, ballNumber) => {
      try {
        const ball = await gameService.markBall(gameId, userId, ballNumber);
        socket.emit("ballMarked", ball);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("checkWinCondition", async (gameId, userId) => {
      try {
        const result = await gameService.checkWinCondition(gameId, userId);
        if (result.winner) {
          io.to(gameId).emit("gameWon", result);
        } else {
          socket.emit("playerRemoved", result);
        }
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("endGame", async (gameId) => {
      try {
        const game = await gameService.endGame(gameId);
        io.to(gameId).emit("gameEnded", game);

        io.emit("gameEndedAll", game);
      } catch (err) {
        emitError(err.message);
      }
    });

    socket.on("disconnect", () => {});
  });
};
