---
layout: post
title: "Why PostGIS?"
date: 2016-04-19 12:00:00
desc: Why PostGIS and how do I start?
tags: ["Postgres", "PostGIS", "geographic data"]
---

Postgres offers a number of [geometric data types](http://www.postgresql.org/docs/9.4/static/datatype-geometric.html), making for simple spatial queries on your data. It is tempting to use these native geometric data types when storing geographic information. Points in geographic space are typically mapped as latitude and longitude, which are, after all, just y and x coordinates, right? The problem is that in geometric terms, x and y are Cartesian coordinates &mdash; that is, they are mapped on a flat surface. Latitude and longitude are angular coordinates that map to a curved surface. 

This difference may not seem like a big deal, but it becomes very important when thinking about spatial relations. If you are on a Cartesian plane and want to move 1 unit in the `x` direction, your `y` coordinate doesn't matter. You could be at `y = 0` or `y = -89` or `y = 532`. One unit of `x` will be the same distance at all of those points. Now imagine you are standing at the equator. You want to travel one degree of longitude from where you currently are. One degree of longitude at the equator is about 111 km, so you head off. Later that week, you are standing one meter from the North Pole. You decide to travel one degree of longitude from your current position when you realize you only need to move about 1.7 cm to get there.

Now imagine you are wanting to store points in a database. You want to be able to query for all points within 50 km of a given location. If the world were flat, Postgres geometric data types would be perfect for querying this geographic information. Since it is round, we can use the awesome PostGIS extension to get the results that we want.

If you are on a Mac and are using [Postgres.app](http://postgresapp.com/), you likely already have the PostGIS extension installed. Otherwise, download and installation instructions can be found on the [PostGIS site](http://postgis.net/). Once we have Postgres up and running and PostGIS installed, we need to create a database and add the extension to this db instance.

{% highlight plaintext %}
$ createdb mySpatialDB
$ psql mySpatialDB
{% endhighlight %}

Which opens up the command line interface for Postgres and specifies that we want to work with the `mySpatialDB` database. To add the PostGIS extension:

{% highlight plaintext %}
mySpatialDB=# CREATE EXTENSION postgis;
{% endhighlight %}

If all goes as planned, you should see `CREATE EXTENSION` pop up underneath this command. Great, now we are up and running with PostGIS! Time to create some tables, add some data, and start spatially querying!