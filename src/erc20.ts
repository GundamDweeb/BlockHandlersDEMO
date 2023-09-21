
  import {
    Approval as ApprovalEvent,
    Transfer as TransferEvent,
  } from "../generated/templates/Token/IERC20";
  import {BlockTransferData} from '../generated/schema'
  import { log } from "@graphprotocol/graph-ts"
  
  export function handleTransfer(event: TransferEvent): void {
    let transferData = BlockTransferData.load(event.block.number.toString())
    if(!transferData){
        let transferData = new BlockTransferData(event.block.number.toString())
        transferData.transferAmount = event.params.value;
        transferData.save()
    } else {
        transferData.transferAmount = transferData.transferAmount.plus(event.params.value);
        transferData.save()
    }
    log.info("Transfer - tokenAddress: {}, amount: {}, from: {}, to: {}", [event.address.toHexString(), event.params.value.toHexString(), event.params.from.toHexString(), event.params.to.toHexString()])
  }
  