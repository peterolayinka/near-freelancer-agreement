import { Context, u128, PersistentVector, ContractPromiseBatch, logging } from "near-sdk-core";
import { assert_single_promise_success, XCC_GAS } from "../../utils"


export const NEW = "NEW";
export const ACCEPTED = "ACCEPTED";
export const INPROGRESS = "INPROGRESS";
export const FINISHED = "FINISHED";
export const CANCELLED = "CANCELLED";
export const REVIEWING = "REVIEWING";
export const PAID = "PAID";


@nearBindgen
export class Project {
  public id: i32;
  public owner: string;
  public title: string;
  public description: string;
  public contractor: string;
  public status: string;
  public amount: u128 = u128.Zero;
  public created_at: u64;
  public started_at: u64;
  public finished_at: u64;
  public reviewed_at: u64;
  public paid_at: u64;
  public cancelled_at: u64;
  // public comments:PersistentMap<AccountId,string>;

  constructor(
    title: string,
    description: string,
    contractor: string,
  ) {
    const deposit = Context.attachedDeposit
    assert(deposit > u128.Zero, "You can't start a project with 0 balance");
    this.id = Projects.length;
    this.owner = Context.sender;
    this.title = title;
    this.description = description;
    this.contractor = contractor;
    this.amount = deposit;
    this.status = NEW
    this.created_at = Context.blockTimestamp
    logging.log(`project worth ${this.amount} created`)
    // this.comments = new PersistentMap<AccountId,string>("v");
  }

  @mutateState()
  reassign_contractor(contractor: string): string {
    assert(this.owner !== Context.sender, "You are not allowed to cancel this project");
    assert(this.status !== NEW, "You can't reassign contractor because project has already started");
    this.contractor = contractor;
    logging.log(`project worth ${this.amount} was reassigned`)
    Projects.replace(this.id, this)
    return "reassigned"
  }

  @mutateState()
  update_status(contractor: string, action: string): string {
    assert([CANCELLED, ACCEPTED, INPROGRESS, FINISHED, REVIEWING, PAID].includes(action), "No such status exists");

    if (action == CANCELLED) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      this.transfer(this.owner);
      this.status = CANCELLED;
      this.cancelled_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} was cancelled`)
      Projects.replace(this.id, this)
      return "project cancelled";
    }

    if (action == ACCEPTED) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      if (this.status == NEW){
        this.status = ACCEPTED;
        this.started_at = Context.blockTimestamp
        logging.log(`project worth ${this.amount} was accepted`)
        Projects.replace(this.id, this)
        return "accepted"
      }
    }

    if (action == INPROGRESS) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      if (this.status == ACCEPTED){
        this.status = INPROGRESS;
        logging.log(`project worth ${this.amount} was started`)
        Projects.replace(this.id, this)
        return "started"
      }
    }

    if (action == FINISHED) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      if (this.status == INPROGRESS){
        this.status = FINISHED;
        this.finished_at = Context.blockTimestamp
        logging.log(`project worth ${this.amount} was concluded`)
        Projects.replace(this.id, this)
        return "finished"
      }
    }

    if (action == REVIEWING) {
      assert(this.owner == contractor, "You are not the owner of this project");
      if(this.status == FINISHED){
        this.status = REVIEWING;
        this.reviewed_at = Context.blockTimestamp
        logging.log(`project worth ${this.amount} started review`)
        Projects.replace(this.id, this)
        return "reviewing";
      }
    }

    if (action == PAID) {
      assert(this.owner == contractor, "You are not the owner of this project");
      if (this.status == REVIEWING){
        this.transfer(this.contractor);
        this.status = PAID;
        this.paid_at = Context.blockTimestamp;
        logging.log(`Owner sertisfied with project worth ${this.amount}`)
        Projects.replace(this.id, this)
        return "paid";
      }
    }

    return "invalid action"
  }

  private transfer(account: string): void {
    const to_account = ContractPromiseBatch.create(account)
    // transfer earnings to owner then confirm transfer complete
    to_account.transfer(this.amount).then(Context.contractName).function_call("on_transfer_complete", '{}', u128.Zero, XCC_GAS)
  }

  @mutateState()
  on_transfer_complete(): void {
    assert_single_promise_success()
    logging.log(`Transfer worth ${this.amount} completed`)
  }
}

/**
 * setup a generic subclass instead of duplicating the get_last method
 */

@nearBindgen
export class Vector<T> extends PersistentVector<T> {
  /**
   * this method isn't normally available on a PersistentVector
   * so we add it here to make our lives easier when returning the
   * last `n` items for comments, votes and donations
   * @param count
   */
  get_last(count: i32): Array<T> {
    const n = min(count, this.length);
    const startIndex = this.length - n;
    const result = new Array<T>();
    for (let i = startIndex; i < this.length; i++) {
      const entry = this[i];
      result.push(entry);
    }
    return result;
  }
}

@nearBindgen
export class ReturnedProject {
    constructor(public id: i32, public project: Project) {
    }
}


export let Projects = new Vector<Project>("Project")