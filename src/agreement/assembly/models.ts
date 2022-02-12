import { Context, u128, PersistentVector, ContractPromiseBatch, logging } from "near-sdk-core";
import { assert_single_promise_success, XCC_GAS } from "../../utils"


// type AccountId = string;
// type Address = string;

// export enum ProjectStatus {
//   NEW = "NEW",
//   ACCEPTED = "ACCEPTED",
//   INPROGRESS = "INPROGRESS",
//   FINISHED = "FINISHED",
//   CANCELLED = "CANCELLED",
//   REVIEWING = "REVIEWING",
//   PAID = "PAID"
// }
const NEW = "NEW";
const ACCEPTED = "ACCEPTED";
const INPROGRESS = "INPROGRESS";
const FINISHED = "FINISHED";
const CANCELLED = "CANCELLED";
const REVIEWING = "REVIEWING";
const PAID = "PAID";

// export type ProjectStatus = "NEW" |"ACCEPTED" | "INPROGRESS" | "FINISHED" | "CANCELLED" | "REVIEWING" | "PAID";

@nearBindgen
export class Project {
  public id: u64;
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
    // owner: string,
    title: string,
    description: string,
    contractor: string,
  ) {
    const deposit = Context.attachedDeposit
    assert(deposit > u128.Zero, "You can't start a project with 0 balance");
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
  reassign_contractor(contractor: string): void {
    assert(this.status !== NEW, "You can't reassign contractor because project has already started");
    this.contractor = contractor;
    logging.log(`project worth ${this.amount} was reassigned`)

  }

  @mutateState()
  update_status(contractor: string, action: string): void {
    if (action == CANCELLED) {
      assert(this.contractor == contractor, "You are not allowed to cancel this project");
      this.status = CANCELLED;
      this.cancelled_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} was cancelled`)
      // return money to owner
    }

    if (action == ACCEPTED && this.status == NEW) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      this.status = ACCEPTED;
      this.started_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} was accepted`)
    }

    if (action == INPROGRESS && this.status == ACCEPTED) {
      assert(this.contractor == contractor, "You are not allowed to cancel this project");
      this.status = CANCELLED;
      this.cancelled_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} was started`)
      // return money to owner
    }

    if (action == FINISHED && this.status == INPROGRESS) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      this.status = FINISHED;
      this.finished_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} was concluded`)
    }

    if (action == REVIEWING && this.status == FINISHED) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      this.status = REVIEWING;
      this.reviewed_at = Context.blockTimestamp
      logging.log(`project worth ${this.amount} started review`)
    }

    if (action == PAID && this.status == REVIEWING) {
      assert(this.contractor == contractor, "This project was not assigned to you.");
      this.status = PAID;
      this.paid_at = Context.blockTimestamp
      logging.log(`Owner sertisfied with project worth ${this.amount}`)
      // transfer money to contractor
    }

  }

  transfer(account: string): void {
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

export let Projects = new Vector<Project>("Project")