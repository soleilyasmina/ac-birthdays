# Villager Birthdays

<img src="./acleaf.png" width=200 />

## Abstract
This is a Node.js app that, once a day, fetches current villager birthdays from the Nookipedia API, as well as photos and information about each villager, and posts it to [@villagerbdays](https://twitter.com/villagerbdays) on Twitter. A cron job via Google Cloud triggers a POST request to the `/daily` endpoint exposed by the Express server.

## Future Endeavors
- Creating a single tweet with the aforementioned information, as opposed to threaded replies for each villager.

## Acknowledgments
Thank you very much to [Nookipedia](https://nookipedia.com/) for the use of their API!