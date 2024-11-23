---
sidebar_position: 2
---


How nginx processes a request
-----------------------------
#### Name-based virtual servers

nginx first decides which _server_ should process the request. Let’s start with a simple configuration where all three virtual servers listen on port \*:80:

> ```
> server {
>     listen      80;
>     server\_name example.org www.example.org;
>     ...
> }
> 
> server {
>     listen      80;
>     server\_name example.net www.example.net;
>     ...
> }
> 
> server {
>     listen      80;
>     server\_name example.com www.example.com;
>     ...
> }
> 
> ```

In this configuration nginx tests only the request’s header field “Host” to determine which server the request should be routed to. If its value does not match any server name, or the request does not contain this header field at all, then nginx will route the request to the default server for this port. In the configuration above, the default server is the first one — which is nginx’s standard default behaviour. It can also be set explicitly which server should be default, with the `default_server` parameter in the [listen](http://nginx.org/ngx_http_core_module.html#listen) directive:

> ```
> server {
>     listen      80 **default\_server**;
>     server\_name example.net www.example.net;
>     ...
> }
> 
> ```

> The `default_server` parameter has been available since version 0.8.21. In earlier versions the `default` parameter should be used instead.

Note that the default server is a property of the listen port and not of the server name. More about this later.

[](http://nginx.org/en/docs/http/request_processing.html)

#### How to prevent processing requests with undefined server names

If requests without the “Host” header field should not be allowed, a server that just drops the requests can be defined:

> ```
> server {
>     listen      80;
>     server\_name "";
>     return      444;
> }
> 
> ```

Here, the server name is set to an empty string that will match requests without the “Host” header field, and a special nginx’s non-standard code 444 is returned that closes the connection.

> Since version 0.8.48, this is the default setting for the server name, so the `server_name ""` can be omitted. In earlier versions, the machine’s _hostname_ was used as a default server name.

[](http://nginx.org/en/docs/http/request_processing.html)

#### Mixed name-based and IP-based virtual servers

Let’s look at a more complex configuration where some virtual servers listen on different addresses:

> ```
> server {
>     listen      192.168.1.1:80;
>     server\_name example.org www.example.org;
>     ...
> }
> 
> server {
>     listen      192.168.1.1:80;
>     server\_name example.net www.example.net;
>     ...
> }
> 
> server {
>     listen      192.168.1.2:80;
>     server\_name example.com www.example.com;
>     ...
> }
> 
> ```

In this configuration, nginx first tests the IP address and port of the request against the [listen](http://nginx.org/ngx_http_core_module.html#listen) directives of the [server](http://nginx.org/ngx_http_core_module.html#server) blocks. It then tests the “Host” header field of the request against the [server\_name](http://nginx.org/ngx_http_core_module.html#server_name) entries of the [server](http://nginx.org/ngx_http_core_module.html#server) blocks that matched the IP address and port. If the server name is not found, the request will be processed by the default server. For example, a request for `www.example.com` received on the 192.168.1.1:80 port will be handled by the default server of the 192.168.1.1:80 port, i.e., by the first server, since there is no `www.example.com` defined for this port.

As already stated, a default server is a property of the listen port, and different default servers may be defined for different ports:

> ```
> server {
>     listen      192.168.1.1:80;
>     server\_name example.org www.example.org;
>     ...
> }
> 
> server {
>     listen      192.168.1.1:80 **default\_server**;
>     server\_name example.net www.example.net;
>     ...
> }
> 
> server {
>     listen      192.168.1.2:80 **default\_server**;
>     server\_name example.com www.example.com;
>     ...
> }
> 
> ```

[](http://nginx.org/en/docs/http/request_processing.html)

#### A simple PHP site configuration

Now let’s look at how nginx chooses a _location_ to process a request for a typical, simple PHP site:

> ```
> server {
>     listen      80;
>     server\_name example.org www.example.org;
>     root        /data/www;
> 
>     location / {
>         index   index.html index.php;
>     }
> 
>     location ~\* \\.(gif|jpg|png)$ {
>         expires 30d;
>     }
> 
>     location ~ \\.php$ {
>         fastcgi\_pass  localhost:9000;
>         fastcgi\_param SCRIPT\_FILENAME
>                       $document\_root$fastcgi\_script\_name;
>         include       fastcgi\_params;
>     }
> }
> 
> ```

nginx first searches for the most specific prefix location given by literal strings regardless of the listed order. In the configuration above the only prefix location is “`/`” and since it matches any request it will be used as a last resort. Then nginx checks locations given by regular expression in the order listed in the configuration file. The first matching expression stops the search and nginx will use this location. If no regular expression matches a request, then nginx uses the most specific prefix location found earlier.

Note that locations of all types test only a URI part of request line without arguments. This is done because arguments in the query string may be given in several ways, for example:

> ```
> /index.php?user=john&page=1
> /index.php?page=1&user=john
> 
> ```

Besides, anyone may request anything in the query string:

> ```
> /index.php?page=1&something+else&user=john
> 
> ```

Now let’s look at how requests would be processed in the configuration above:

```html
*   A request “`/logo.gif`” is matched by the prefix location “`/`” first and then by the regular expression “`\.(gif|jpg|png)$`”, therefore, it is handled by the latter location. Using the directive “`root /data/www`” the request is mapped to the file `/data/www/logo.gif`, and the file is sent to the client.
*   A request “`/index.php`” is also matched by the prefix location “`/`” first and then by the regular expression “`\.(php)$`”. Therefore, it is handled by the latter location and the request is passed to a FastCGI server listening on localhost:9000. The [fastcgi\_param](http://nginx.org/ngx_http_fastcgi_module.html#fastcgi_param) directive sets the FastCGI parameter `SCRIPT_FILENAME` to “`/data/www/index.php`”, and the FastCGI server executes the file. The variable `$document_root` is equal to the value of the [root](http://nginx.org/ngx_http_core_module.html#root) directive and the variable `$fastcgi_script_name` is equal to the request URI, i.e. “`/index.php`”.
*   A request “`/about.html`” is matched by the prefix location “`/`” only, therefore, it is handled in this location. Using the directive “`root /data/www`” the request is mapped to the file `/data/www/about.html`, and the file is sent to the client.
*   Handling a request “`/`” is more complex. It is matched by the prefix location “`/`” only, therefore, it is handled by this location. Then the [index](http://nginx.org/ngx_http_index_module.html#index) directive tests for the existence of index files according to its parameters and the “`root /data/www`” directive. If the file `/data/www/index.html` does not exist, and the file `/data/www/index.php` exists, then the directive does an internal redirect to “`/index.php`”, and nginx searches the locations again as if the request had been sent by a client. As we saw before, the redirected request will eventually be handled by the FastCGI server.

written by Igor Sysoev<br>edited by Brian Mercer
```
  

本文转自 [http://nginx.org/en/docs/http/request\_processing.html](http://nginx.org/en/docs/http/request_processing.html)，如有侵权，请联系删除。