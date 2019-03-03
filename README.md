# web2m3c
An scrapping application based on nodejs for Google cloud functions example.
It parses the https://acelisting.in/ web in order to get show links for streaming watching.

To filter shows use the following body example in a POST request:
```
{
    filter: {
	    time: '22:30',
	    date: '20 Mar',
	    sport: 'soccer',
	    match: 'liverpool',
	    league: 'premier league'
    }
}
```

To customize the acestream url you can add your localIpDevice using the same body object as below:
```
{
    filter: {
	    time: '22:30',
	    date: '20 Mar',
	    sport: 'soccer',
	    match: 'liverpool',
	    league: 'premier league'
    },
    localIp: 'http://192.168.1.1:6879
}
```