from pyteal import *

from shoe_store_contract import Shoe_Store

if __name__ == "__main__":
    approval_program = Shoe_Store().approval_program()
    clear_program = Shoe_Store().clear_program()

    # Mode.Application specifies that this is a smart contract
    compiled_approval = compileTeal(approval_program, Mode.Application, version=6)
    print(compiled_approval)
    with open("shoe_store_contract_approval.teal", "w") as teal: 
        teal.write(compiled_approval)
        teal.close()

    # Mode.Application specifies that this is a smart contract
    compiled_clear = compileTeal(clear_program, Mode.Application, version=6)
    print(compiled_clear)
    with open("shoe_store_contract_clear.teal", "w") as teal:
        teal.write(compiled_clear)
        teal.close()
