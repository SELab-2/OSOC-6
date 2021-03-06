## Set up The Server

To make our project run, we will need a web server. For this we recommend using NGINX.
```
sudo apt install nginx
```

### Configure NGINX

We will have two different applications running on the same domain. 
To make this possible,
we need to configure NGINX in a way that if we go to `www.our-domain.com/` we go to the front end.
However, when  we go to `www.our-domain.com/api` that information goes to the back end.

To configure this, follow these steps:

Go to the following location:
```
cd /etc/nginx/conf.d/
```
Backup our default configuration file to be safe you can always back up this file. 
```
cp default.conf default.conf.backup
```
Now we will edit the configuration by calling:
```
sudo nano /etc/nginx/conf.d/default.conf
```
Here you will find the configuration of our server. Locate the part where it says
```
location / {
	...
}
```
And replace it with the following:
```
location / {
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://localhost:3000;
    }
```
The first and the last lines are the most important ones.
`location /` tells NGINX what it needs to do when going to `our-domain.com/`.
The last line tells it that it needs to forward this to the application running on localhost on port 3000.

Next, we need to do the same for `/api`.  Right under the block for `/`, we can add the following:
```
location /api {
        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://localhost:2999;
  }
```
The same logic applies here.
If we go to `/api` the information gets passed forward to the application running on localhost on port 2999.

Now we need to verify for syntax errors and restart NGINX:
```
sudo nginx -t
```
```
sudo systemctl restart nginx
```
We're almost done with setting up NGINX. The last step is configuring the firewall.
```
sudo ufw enable
```
```
sudo ufw allow 'Nginx Full'
```
Note: If you have SSH running on the server, don't forget to enable port 22 in the firewall.
```
sudo ufw allow ssh
```

### Configure Back end and Front end

#### Back end

The easiest is to follow [this link](https://github.com/SELab-2/OSOC-6/wiki/Development-setup) first.
After you have done that, everything to run the back end is set up.

To run the back end, you simply can go to the `/backend` folder and run the following command.
```
./gradlew task build && ./gradlew task bootRun
```
This will work fine. However, when the server restarts, you will need to do this all over again.
To make this more simple, we are going to use a process manager (PM2).
However, this requires nodejs. If this is not yet installed, do so by running:
```
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
```
```
sudo apt-get install -y nodejs
```
Now that nodejs is installed. We can install PM2.
```
sudo npm install pm2@latest -g
```
With that installed, we can make a service to run our back end.
Replace `giveThisAName` with a name you want to add to this process.
```
pm2 start "./gradlew task build && ./gradlew task bootRun" --name giveThisAName
```
Now we have made a process.
We just need to make sure it gets started when the server is started.
```
pm2 startup systemd
```
This command will produce some output.
You need to copy the last line of the output, it will look something like this.
```
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u selab2 --hp /home/selab2
```
But the user will be replaced with your user running locally.
Run the command and you're all set.

#### Front end
The last part we need to configure is the front end. To do so, go to the `/frontend` folder of our project.

In there run the following command to install all dependencies.
```
npm install
```

Next, you can run the front end with `npm run dev`, but we wil also make a service of this.
Simply run the following commands and change `giveThisAName` accordingly.
```
pm2 start "npm run dev" --name giveThisAName
pm2 save
```
You're all set, everything should be up and running.

#### SSL Certificate

However, you might still need an SSL certificate for your website.
If you already have this, you can skip this part.

To get a certificate, you need the NGINX plugin from Certbot. To install this run the following:
```
sudo apt install certbot python3-certbot-nginx
```
Next, run the plugin and change `your-domain.com` to your actual domain the project will be running on.
```
sudo certbot --nginx -d your-domain.com
```
Follow the steps in the command line.

Congratulations, you now have an up and running instance of our back end and front end, both with SSL certificate!
