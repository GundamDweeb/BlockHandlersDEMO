import { BlockTransferData, TenBlocksAggregate } from '../generated/schema';
import {Token as ERC20Template} from "../generated/templates"
import { Address, BigInt, ethereum, log, store } from '@graphprotocol/graph-ts';

let contracts : Array<string>= [
"0x4318da0a69c40038d5305b84139bbb1ff1d46176",
"0xa2530ca93c1422a85898d24cd43b1458de99719f",
"0xdfe1a88513204a2f93c89f59f6f0cfc77e7dd319",
"0xe1f7a063f19f53ad8a79d564811cae0c0670b10a",
"0xe5952f1e9d4d8d5851215244d88c6aa692871dd3",
];

export function handleSetup(block:  ethereum.Block): void {
  log.info("Setup Handler Start", [])
  for(let i = 0; i < contracts.length; i++){
    ERC20Template.create(Address.fromString(contracts[i]))
    log.info("Setup Handler for {}", [contracts[i]])
  }
  log.info("Setup Handler End", [])
}

export function handleTen(block:  ethereum.Block): void {
  let tenLessBlocks = block.number.toI32() - 10;
  let blockNumberInt = block.number.toI32();
  let transferAggregate = BigInt.fromI32(0);
  for(let i = tenLessBlocks; i < blockNumberInt + 1; i++){
    let blockTransferData = BlockTransferData.load(i.toString())
    if(blockTransferData){
      transferAggregate = transferAggregate.plus(blockTransferData.transferAmount);
      store.remove("BlockTransferData", blockTransferData.id)
    }
  }
  if(transferAggregate > BigInt.fromI32(0)){
    let tenBlocks = new TenBlocksAggregate(tenLessBlocks.toString().concat("-").concat(blockNumberInt.toString()))
    tenBlocks.transferAmount = transferAggregate;
    tenBlocks.startBlock = block.number.minus(BigInt.fromI32(10));
    tenBlocks.endBlock = block.number;
    tenBlocks.save()
  }
}