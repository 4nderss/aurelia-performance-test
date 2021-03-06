import { HttpClient } from "aurelia-fetch-client";
import { inject, computedFrom, TaskQueue } from "aurelia-framework";

@inject(HttpClient, TaskQueue)
export class App {

  constructor(private client: HttpClient, private taskQueue: TaskQueue) {
    client.configure(config => {
      config
        .useStandardConfiguration()
    });
  }

  message = 'Hello World!';

  properties: string[];
  users: any[];
  activate() {

    //see that data is loaded before we start
    return this.client.fetch('https://api.github.com/users')
      .then(response => response.json())
      .then(users => {
        let res = users as any;
        let usersToAdd = [];
        while (usersToAdd.length < 1000) {
          for (var index = 0; index < res.length; index++) {
            var element = res[index];
            usersToAdd.push(element);
          }
        }
        return usersToAdd;
      }).then(usersToAdd => {
        this.users = usersToAdd;

      }).then(x => {
        this.properties = [];
        let object = this.users[0];
        for (var property in object) {
          if (object.hasOwnProperty(property)) {
            this.properties.push(property);
          }
        }
      }).then(x => {
        this.performanceTime = performance.now();
      });
  }

  performanceTime: number;
  attached() {
    this.taskQueue.queueTask(() => {
      this.performanceTime = (performance.now() - this.performanceTime) | 0;
    });
  }
}
