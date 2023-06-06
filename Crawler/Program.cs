using GameOfThronesCrawler.Database;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace GameOfThronesCrawler
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //MongoDB

            // Connection string and database name
            //string connectionString = "mongodb://localhost:27017";
            //string databaseName = "gameofthrones";

            //// Create a MongoClient to connect to the MongoDB server
            //MongoClient client = new MongoClient(connectionString);

            //// Access the database
            //IMongoDatabase database = client.GetDatabase(databaseName);

            //// Check if the collection exists, create it if not
            //string collectionName = "scores";
            //bool collectionExists = CollectionExists(database, collectionName);
            //if (!collectionExists)
            //{
            //    CreateCollection(database, collectionName);
            //}

            builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

            builder.Services.AddSingleton<IMongoDbSettings>(serviceProvider =>
                serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value);

            builder.Services.AddScoped(typeof(IMongoRepository<>), typeof(MongoRepository<>));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpClient();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
                app.UseSwagger();
                app.UseSwaggerUI();
            //}

            app.UseCors(builder => builder
            .AllowAnyOrigin() // Allow requests from any origin
            .AllowAnyMethod() // Allow all HTTP methods
            .AllowAnyHeader() // Allow all headers
        );

            // Other app configurations...

            app.UseRouting();

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }

        //private static bool CollectionExists(IMongoDatabase database, string collectionName)
        //{
        //    // List all the collections in the database
        //    var filter = new BsonDocument("name", collectionName);
        //    var collections = database.ListCollections(new ListCollectionsOptions { Filter = filter });

        //    // Check if the collection exists
        //    return collections.Any();
        //}

        //private static void CreateCollection(IMongoDatabase database, string collectionName)
        //{
        //    // Create the collection with default options
        //    database.CreateCollection(collectionName);
        //}
    }
}