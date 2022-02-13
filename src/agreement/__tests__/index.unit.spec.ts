import { NEW, ACCEPTED, INPROGRESS, FINISHED, CANCELLED, REVIEWING, PAID } from "../assembly/models";
import {
  VMContext,
  u128,
} from "near-sdk-as";
import { Contract } from "../assembly";

/**
 * == CONFIG VALUES ============================================================
 */
const TITLE = "project tile";
const DESCRIPTION = "text description";
const OWNER_ACCOUNT_ID = "peter";
const CONTRACTOR_ACCOUNT_ID = "alice";
const OTHER_ACCOUNT_ID = "tola";
const ONE_NEAR = u128.from("1000000000000000000000000");
const ATTACHED_DEPOSIT = u128.mul(ONE_NEAR, u128.from(10));


let contract: Contract;

beforeEach(() => {
  contract = new Contract();
});

describe("Contract", () => {
  beforeEach(() => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID);
    VMContext.setAttached_deposit(ATTACHED_DEPOSIT);
    contract.create_project(TITLE, DESCRIPTION, CONTRACTOR_ACCOUNT_ID);
    contract.create_project(TITLE, DESCRIPTION, OTHER_ACCOUNT_ID);
  })
  it(`owner can view projects created`, () => {
    expect(contract.projects_created().length).toBe(2)
  })
  it(`contractor can view projects assigned`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID)
    expect(contract.projects_assigned().length).toBe(1)
  })
  it(`owner shouldn't have any assigned project`, () => {
    const project = contract.projects_assigned();
    expect(project.length).toBe(0)
  })
  it("can get latest project", () => {
    const project = contract.latest_projects();
    expect(project.length).toBe(2)
  })
  it(`owner can get project detail`, () => {
    const project = contract.project_detail(0);
    expect(project.owner).toBe(OWNER_ACCOUNT_ID);
    expect(project.contractor).toBe(CONTRACTOR_ACCOUNT_ID);
    expect(project.title).toBe(TITLE);
    expect(project.description).toBe(DESCRIPTION);
    expect(project.amount).toBe(ATTACHED_DEPOSIT);
  })
  it(`contractor can get project detail`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    const project = contract.project_detail(0);
    expect(project.owner).toBe(OWNER_ACCOUNT_ID);
    expect(project.contractor).toBe(CONTRACTOR_ACCOUNT_ID);
    expect(project.title).toBe(TITLE);
    expect(project.description).toBe(DESCRIPTION);
    expect(project.amount).toBe(ATTACHED_DEPOSIT);
  })
  itThrows("other accounts can't get project detail", () => {
    VMContext.setSigner_account_id(OTHER_ACCOUNT_ID);
    contract.project_detail(0);
  });
  it(`owner can reassign contractor`, () => {
    let project = contract.project_detail(0);
    expect(project.contractor).toBe(CONTRACTOR_ACCOUNT_ID);
    contract.reassign_contractor(0, OTHER_ACCOUNT_ID);
    project = contract.project_detail(0);
    expect(project.contractor).toBe(OTHER_ACCOUNT_ID);
  })
  itThrows("other can't reassign contractor", () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.project_detail(0);
    contract.reassign_contractor(0, OTHER_ACCOUNT_ID);
  });
  itThrows("can't pass invalid status to project", () => {
    contract.update_status(0, "INVALID");
  });
  it(`contractor can cancel project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, CANCELLED);
    const project = contract.project_detail(0);
    expect(project.status).toBe(CANCELLED);
  })
  itThrows("other can't cancel project", () => {
    contract.update_status(0, CANCELLED);
  });
  it(`contractor can accept project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    const project = contract.project_detail(0);
    expect(project.status).toBe(ACCEPTED);
  })
  itThrows("other can't accept project", () => {
    contract.update_status(0, ACCEPTED);
  });
  it(`contractor can start project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    contract.update_status(0, INPROGRESS);
    const project = contract.project_detail(0);
    expect(project.status).toBe(INPROGRESS);
  })
  itThrows("other can't start project", () => {
    contract.update_status(0, INPROGRESS);
  });
  it(`contractor can finish project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    contract.update_status(0, INPROGRESS);
    contract.update_status(0, FINISHED);
    const project = contract.project_detail(0);
    expect(project.status).toBe(FINISHED);
  })
  itThrows("other can't finish project", () => {
    contract.update_status(0, FINISHED);
  });
  it(`contractor can finish project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    contract.update_status(0, INPROGRESS);
    contract.update_status(0, FINISHED);
    const project = contract.project_detail(0);
    expect(project.status).toBe(FINISHED);
  })
  itThrows("other can't finish project", () => {
    contract.update_status(0, FINISHED);
  });
  it(`owner can review project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    contract.update_status(0, INPROGRESS);
    contract.update_status(0, FINISHED);
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID);
    contract.update_status(0, REVIEWING);
    const project = contract.project_detail(0);
    expect(project.status).toBe(REVIEWING);
  })
  itThrows("other can't review project", () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, REVIEWING);
  });
  it(`owner can pay contractor for project`, () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, ACCEPTED);
    contract.update_status(0, INPROGRESS);
    contract.update_status(0, FINISHED);
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID);
    contract.update_status(0, REVIEWING);
    contract.update_status(0, PAID);
    const project = contract.project_detail(0);
    expect(project.status).toBe(PAID);
  })
  itThrows("other can't pay contractor for project", () => {
    VMContext.setSigner_account_id(CONTRACTOR_ACCOUNT_ID);
    contract.update_status(0, PAID);
  });
})

describe("Project Creation", () => {
  it("can create project", () => {
    VMContext.setSigner_account_id(OWNER_ACCOUNT_ID);
    VMContext.setAttached_deposit(ATTACHED_DEPOSIT);
    contract.create_project(TITLE, DESCRIPTION, CONTRACTOR_ACCOUNT_ID);
    const project = contract.latest_projects();
    expect(project.length).toBe(1);
    expect(project[0].owner).toBe(OWNER_ACCOUNT_ID);
    expect(project[0].contractor).toBe(CONTRACTOR_ACCOUNT_ID);
    expect(project[0].title).toBe(TITLE);
    expect(project[0].description).toBe(DESCRIPTION);
    expect(project[0].amount).toBe(ATTACHED_DEPOSIT);
    expect(project[0].status).toBe(NEW);
  });
});