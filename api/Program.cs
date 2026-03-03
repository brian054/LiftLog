using LiftLog.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Tell ASP.NET's DI container how to create AppDbContext:
// use PostgreSQL and the "Default" connection string from appsettings.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
// CORS = Cross-Origin Resource Sharing
// Normally, browsers will block JS from calling a diff origin by default (security reasons), when
// React tries to fetch() the API the browser says 'nope' unless our API here replies with CORS headers like
// Access-Control-Allow-Origin: locahost/portNumForOurAPI
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy.WithOrigins("http://localhost:5173") // so only allow this origin (React frontend in this case) to call any API methods
              .AllowAnyHeader()
              .AllowAnyMethod());
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // serves /swagger/v1/swagger.json by default

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LiftLog API v1");
        c.RoutePrefix = string.Empty; // swagger UI at "/"
    });
}

app.UseCors("DevCors");
//app.UseHttpsRedirection();
app.MapControllers();
app.Run();