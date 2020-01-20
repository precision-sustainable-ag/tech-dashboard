#base image
FROM node:latest

#set up work dir

WORKDIR /app

#add /app/node_modules/.bin to $path

ENV PATH /app/node_modules/.bin:$PATH

#install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
EXPOSE 80

#start app 

CMD ["npm", "start"]