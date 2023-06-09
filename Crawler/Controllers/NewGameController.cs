﻿using GameOfThronesCrawler.Helpers;
using GameOfThronesCrawler.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace GameOfThronesCrawler.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewGameController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const int NumberOfQuotes = 10;


        public NewGameController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        /// <summary>
        /// Endpoint to get a list of GameQuestions
        /// </summary>
        /// <returns></returns>
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            var quotes = await GetRandomQuotes(NumberOfQuotes);
            var gameQuestions = PrepareGameQuestions(quotes);

            return Ok(gameQuestions);
        }

        #region Helper Functions
        private async Task<List<GameQuestion>> PrepareGameQuestions(List<Quote> quotes)
        {
            //TODO: Clean backlashes from all strings
            var gameQuestions = new List<GameQuestion>();

            foreach (var quote in quotes)
            {
                var options = ShuffleCharacters(quote.Character.Name);
                var gameQuestion = new GameQuestion
                {
                    Quote = quote.Sentence,
                    Options = options
                };

                gameQuestions.Add(gameQuestion);
            }

            return gameQuestions;
        }

        private async Task<List<Quote>> GetRandomQuotes(int count)
        {
            var quotes = new List<Quote>();

            for (var i = 0; i < count; i++)
            {
                var response = await _httpClient.GetAsync("https://api.gameofthronesquotes.xyz/v1/random");

                if (!response.IsSuccessStatusCode)
                {
                    continue;
                }

                var quote = await response.Content.ReadFromJsonAsync<Quote>();
                quotes.Add(quote);
            }

            return quotes;
        }

        private List<GameQuestionOption> ShuffleCharacters(string correctOption)
        {
            //TODO: Substitute Characters with actual names
            var options = new List<GameQuestionOption>();

            options.Add(new GameQuestionOption { Option = correctOption, IsCorrect = true });

            // Select three random character names excluding the correct option

            var characterNames = GetCharacters.ReadCharactersFromJson();
            var random = new Random();
            var availableOptions = characterNames.Where(name => name != correctOption).ToList();
            var selectedOptions = SelectThreeRandomStrings(availableOptions);
            options.AddRange(selectedOptions.Select(opt => new GameQuestionOption
            {
                Option = opt,
                IsCorrect = false,
                IsSelected = false
            }));

            // Shuffling the characters
            var shuffledCharacters = options.OrderBy(x => random.Next()).ToList();

            return shuffledCharacters;
        }

        public static List<string> SelectThreeRandomStrings(List<string> strings)
        {
            Random random = new Random();

            List<string> selectedStrings = new List<string>();

            // Check if the list contains at least three strings
            if (strings.Count < 3)
            {
                throw new ArgumentException("The list must contain at least three strings.");
            }

            // Select three random indices without repetition
            HashSet<int> indices = new HashSet<int>();
            while (indices.Count < 3)
            {
                int randomIndex = random.Next(strings.Count);
                indices.Add(randomIndex);
            }

            // Add the selected strings to the result list
            foreach (int index in indices)
            {
                selectedStrings.Add(strings[index]);
            }

            return selectedStrings;
        }


        #endregion
    }
}
