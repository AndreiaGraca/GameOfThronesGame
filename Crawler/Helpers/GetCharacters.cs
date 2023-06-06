using Newtonsoft.Json;

namespace GameOfThronesCrawler.Helpers
{
    public class GetCharacters
    {
        public static async Task GetCharactersAndSaveInAJson()
        {
            // Make the HTTP request to the API
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync("https://api.gameofthronesquotes.xyz/v1/characters");
                var json = await response.Content.ReadAsStringAsync();

                // Deserialize the JSON response into a list of character objects
                var characters = JsonConvert.DeserializeObject<List<Character>>(json);

                // Extract the names from the character objects and create a list of strings
                var characterNames = new List<string>();
                foreach (var character in characters)
                {
                    characterNames.Add(character.Name);
                }

                // Serialize the list of character names to JSON
                var serializedNames = JsonConvert.SerializeObject(characterNames, Formatting.Indented);

                // Save the JSON data to a file
                File.WriteAllText("character_names.json", serializedNames);
            }
        }

        public static List<string> ReadCharactersFromJson()
        {
            var jsonPath = "character_names.json"; // Path to the local JSON file

            var json = File.ReadAllText(jsonPath);
            var characters = JsonConvert.DeserializeObject<List<string>>(json);
            return characters;
        }

        // Define a class to represent the character structure
        public class Character
        {
            public string Name { get; set; }
            public string Slug { get; set; }
            public House House { get; set; }
            public List<string> Quotes { get; set; }
        }

        public class House
        {
            public string Slug { get; set; }
            public string Name { get; set; }
        }
    }

}

