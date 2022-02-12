import { Context, u128 } from "near-sdk-core"
import { Project, Projects } from "./models"


@nearBindgen
export class Contract {
  create_project(title: string, description: string, contractor: string): void{
    Projects.pushBack(new Project(title, description, contractor))
  }

  latest_projects(): Array<Project> {
    return Projects.get_last(10)
  }

  project_created(): Array<Project> | null {
    const result = new Array<Project>(Projects.length);
    for (let i = 0; i < Projects.length; i++) {
      if (Projects[i].owner == Context.sender) {
        result[i] = Projects[i];
      }
    }

    return result
  }

  project_assigned(): Array<Project> | null {
    const result = new Array<Project>(Projects.length);
    for (let i = 0; i < Projects.length; i++) {
      if (Projects[i].contractor == Context.sender) {
        result[i] = Projects[i];
      }
    }

    return result
  }

  project_detail(id: i32): Project {
    assert(Projects.length > 0, "No project created yet")
    assert(id <= (Projects.length - 1), "no such project exists")
    assert((Projects[id].owner == Context.sender || Projects[id].contractor == Context.sender), "you don't have access to this project");
    return Projects[id];
  }

  update_status(id: i32, status: string): void {
    Projects[id].update_status(Context.sender, status)
  }
}
