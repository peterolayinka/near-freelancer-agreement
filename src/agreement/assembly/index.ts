import { Context, u128 } from "near-sdk-core"
import { Project, Projects, ReturnedProject, Vector } from "./models"


@nearBindgen
export class Contract {
  create_project(title: string, description: string, contractor: string): void{
    Projects.pushBack(new Project(title, description, contractor))
  }

  latest_projects(): Project[] {
    return Projects.get_last(10)
  }

  projects_created(): ReturnedProject[] {
    let result = new Array<ReturnedProject>();
    for (let i = 0; i < Projects.length; i++) {
      if (Projects[i].owner == Context.sender) {
        let project = Projects[i]
        result.push(new ReturnedProject(project.id, project));
      }
    }
    return result
  }

  projects_assigned(): ReturnedProject[] {
    let result = new Array<ReturnedProject>();
    for (let i:i32 = 0; i < Projects.length; i++) {
      if (Projects[i].contractor == Context.sender) {
      let project = Projects[i]
      result.push(new ReturnedProject(project.id, project));
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

  reassign_contractor(id: i32, contractor: string): string {
    assert((Projects[id].owner == Context.sender), "you don't have access to this project");
    return Projects[id].reassign_contractor(contractor);
  }

  update_status(id: i32, status: string): string {
    assert((Projects[id].owner == Context.sender || Projects[id].contractor == Context.sender), "you don't have access to this project");
    return Projects[id].update_status(Context.sender, status)
  }
}
