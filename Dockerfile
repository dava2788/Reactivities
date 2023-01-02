FROM mcr.microsoft.com/dotnet/sdk:7.0 as build-env
WORKDIR /app
EXPOSE 8080

#copy .csproj and restore as distinct layers
#this will copy the Reactivities.sln and copy in the 
#/app 
COPY "Reactivities.sln" "Reactivities.sln" 
COPY "API/API.csproj" "API/API.csproj" 
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore "Reactivities.sln"

#then Copy everything else and build
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

#Build a runTime image using aspnet will get us only what we need
#and not the entire SDK
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
#copy everyting from /app/out
COPY --from=build-env /app/out .
#Entrypoint will be dotnet and then the name of the startup project
ENTRYPOINT [ "dotnet","API.dll" ]