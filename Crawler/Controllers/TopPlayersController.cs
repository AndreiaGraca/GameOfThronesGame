using GameOfThronesCrawler.Database;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TopPlayersController : ControllerBase
    {
        private readonly IMongoRepository<GameStats> _gameStatsRepository;

        public TopPlayersController(IMongoRepository<GameStats> gameStatsRepository)
        {
            _gameStatsRepository = gameStatsRepository;

        }

        [HttpGet("Get")]
        public List<GameStats> Get()
        {
            var filter = Builders<GameStats>.Filter.Empty;
            var sort = Builders<GameStats>.Sort.Descending(player => player.Score);
            var limit = 3;

            var topPlayers = _gameStatsRepository.FilterSortLimit(filter, sort, limit).ToList();

            return topPlayers;
        }
    }
}
