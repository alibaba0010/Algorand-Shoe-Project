import algosdk from "algosdk";
import {
    algodClient,
    indexerClient,
    riderNote,
    minRound,
    myAlgoConnect,
    numGlobalBytes,
    numGlobalInts,
    numLocalBytes,
    numLocalInts
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/shoe_store_contract_approval.teal";
import clearProgram from "!!raw-loader!../contracts/shoe_store_contract_clear.teal";
import {base64ToUTF8String, utf8ToBase64String} from "./conversions";

class Car {
    constructor(brand, image, description, location, price, availableCars, sold, appId, owner) {
        this.brand = brand;
        this.image = image;
        this.description = description;
        this.location = location;
        this.price = price;
        this.availableCars = availableCars;
        this.sold = sold;
        this.appId = appId;
        this.owner = owner;
    }
}

// Compile smart contract in .teal format to program
const compileProgram = async (programSource) => {
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await algodClient.compile(programBytes).do();
    return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}

// CREATE SHOE: ApplicationCreateTxn
export const createShoeAction = async (senderAddress, car) => {
    console.log("Adding new car...")

    let params = await algodClient.getTransactionParams().do();

    // Compile programs
    const compiledApprovalProgram = await compileProgram(approvalProgram)
    const compiledClearProgram = await compileProgram(clearProgram)

    // Build note to identify transaction later and required app args as Uint8Arrays
    let note = new TextEncoder().encode(riderNote);
    let brand = new TextEncoder().encode(car.brand);
    let image = new TextEncoder().encode(car.image);
    let description = new TextEncoder().encode(car.description);
    let location = new TextEncoder().encode(car.location);
    let price = algosdk.encodeUint64(car.price);
    let numbercar = Number(car.availableCars);
    let availableCars = algosdk.encodeUint64(numbercar);

    let appArgs = [brand, image, description, location, price, availableCars]

    // Create ApplicationCreateTxn
    let txn = algosdk.makeApplicationCreateTxnFromObject({
        from: senderAddress,
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: compiledApprovalProgram,
        clearProgram: compiledClearProgram,
        numLocalInts: numLocalInts,
        numLocalByteSlices: numLocalBytes,
        numGlobalInts: numGlobalInts,
        numGlobalByteSlices: numGlobalBytes,
        note: note,
        appArgs: appArgs
    });

    // Get transaction ID
    let txId = txn.txID().toString();

    // Sign & submit the transaction
    let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("Signed transaction with txID: %s", txId);
    await algodClient.sendRawTransaction(signedTxn.blob).do();

    // Wait for transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    // Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // Get created application id and notify about completion
    let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
    let appId = transactionResponse['application-index'];
    console.log("Created new app-id: ", appId);
    return appId;
}



  
// ADDING A NEW CAR: Group transaction consisting of ApplicationCallTxn 
export const addmoreShoesAction = async (senderAddress, car, ammount) => {
    console.log("adding car...");
  
    let params = await algodClient.getTransactionParams().do();
  
    // Build required app args as Uint8Array
    let addcarArg = new TextEncoder().encode("addmorecars");
    let newammount_ = Number(ammount);
    let newammount = algosdk.encodeUint64(newammount_);

  
    let appArgs = [addcarArg, newammount];
  
    // Create ApplicationCallTxn
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
      from: senderAddress,
      appIndex: car.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams: params,
      appArgs: appArgs,
    });
  
    let txnArray = [appCallTxn];
  
    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray);
    for (let i = 0; i < 1; i++) txnArray[i].group = groupID;
  
    // Sign & submit the group transaction
    let signedTxn = await myAlgoConnect.signTransaction(
      txnArray.map((txn) => txn.toByte())
    );
    console.log("Signed group transaction");
    let tx = await algodClient
      .sendRawTransaction(signedTxn.map((txn) => txn.blob))
      .do();
  
    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  
    // Notify about completion
    console.log(
      "Group transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
  };
  
// CHANGE LOCATION: Group transaction consisting of ApplicationCallTxn 
export const changelocationAction = async (senderAddress, car, location) => {
    console.log("changing location...");
  
    let params = await algodClient.getTransactionParams().do();
  
    // Build required app args as Uint8Array
    let changelocationArg = new TextEncoder().encode("changelocation");
    let newlocation = new TextEncoder().encode(location);
  
    let appArgs = [changelocationArg, newlocation];
  
    // Create ApplicationCallTxn
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
      from: senderAddress,
      appIndex: car.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      suggestedParams: params,
      appArgs: appArgs,
    });
  
    let txnArray = [appCallTxn];
  
    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray);
    for (let i = 0; i < 1; i++) txnArray[i].group = groupID;
  
    // Sign & submit the group transaction
    let signedTxn = await myAlgoConnect.signTransaction(
      txnArray.map((txn) => txn.toByte())
    );
    console.log("Signed group transaction");
    let tx = await algodClient
      .sendRawTransaction(signedTxn.map((txn) => txn.blob))
      .do();
  
    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  
    // Notify about completion
    console.log(
      "Group transaction " +
        tx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );
  };
  




// BUY SHOE: Group transaction consisting of ApplicationCallTxn and PaymentTxn
export const buyShoeAction = async (senderAddress, car) => {
    console.log("Buying picture...");

    let params = await algodClient.getTransactionParams().do();

    // Build required app args as Uint8Array
    let buyArg = new TextEncoder().encode("buy")
    let appArgs = [buyArg]

    // Create ApplicationCallTxn
    let appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: senderAddress,
        appIndex: car.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        suggestedParams: params,
        appArgs: appArgs
    })

    // Create PaymentTxn
    let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: car.owner,
        amount: car.price,
        suggestedParams: params
    })

    let txnArray = [appCallTxn, paymentTxn]

    // Create group transaction out of previously build transactions
    let groupID = algosdk.computeGroupID(txnArray)
    for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

    // Sign & submit the group transaction
    let signedTxn = await myAlgoConnect.signTransaction(txnArray.map(txn => txn.toByte()));
    console.log("Signed group transaction");
    let tx = await algodClient.sendRawTransaction(signedTxn.map(txn => txn.blob)).do();

    // Wait for group transaction to be confirmed
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

    // Notify about completion
    console.log("Group transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
}

// DELETE SHOE: ApplicationDeleteTxn
export const deleteShoeAction = async (senderAddress, index) => {
    console.log("Deleting application...");

    let params = await algodClient.getTransactionParams().do();

    // Create ApplicationDeleteTxn
    let txn = algosdk.makeApplicationDeleteTxnFromObject({
        from: senderAddress, suggestedParams: params, appIndex: index,
    });

    // Get transaction ID
    let txId = txn.txID().toString();

    // Sign & submit the transaction
    let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
    console.log("Signed transaction with txID: %s", txId);
    await algodClient.sendRawTransaction(signedTxn.blob).do();

    // Wait for transaction to be confirmed
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

    // Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    // Get application id of deleted application and notify about completion
    let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
    let appId = transactionResponse['txn']['txn'].apid;
    console.log("Deleted app-id: ", appId);
}

// GET SHOES: Use indexer
export const getShoesAction = async () => {
    console.log("Fetching cars...")
    let note = new TextEncoder().encode(riderNote);
    let encodedNote = Buffer.from(note).toString("base64");

    // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
    let transactionInfo = await indexerClient.searchForTransactions()
        .notePrefix(encodedNote)
        .txType("appl")
        .minRound(minRound)
        .do();
    let cars = []
    for (const transaction of transactionInfo.transactions) {
        let appId = transaction["created-application-index"]
        if (appId) {
            // Step 2: Get each application by application id
            let car = await getApplication(appId)
            if (car) {
                cars.push(car)
            }
        }
    }
    console.log("Cars fetched.")
    return cars
}


const getApplication = async (appId) => {
    try {
        // 1. Get application by appId
        let response = await indexerClient.lookupApplications(appId).includeAll(true).do();
        if (response.application.deleted) {
            return null;
        }
        let globalState = response.application.params["global-state"]

        // 2. Parse fields of response and return product
        let owner = response.application.params.creator
        let brand = ""
        let image = ""
        let description = ""
        let location = ""
        let price = 0
        let avaiableCars = 0
        let sold = 0

        const getField = (fieldName, globalState) => {
            return globalState.find(state => {
                return state.key === utf8ToBase64String(fieldName);
            })
        }

        if (getField("BRAND", globalState) !== undefined) {
            let field = getField("BRAND", globalState).value.bytes
            brand = base64ToUTF8String(field)
        }

        if (getField("IMAGE", globalState) !== undefined) {
            let field = getField("IMAGE", globalState).value.bytes
            image = base64ToUTF8String(field)
        }

        if (getField("DESCRIPTION", globalState) !== undefined) {
            let field = getField("DESCRIPTION", globalState).value.bytes
            description = base64ToUTF8String(field)
        }

        if (getField("LOCATION", globalState) !== undefined) {
            let field = getField("LOCATION", globalState).value.bytes
            location = base64ToUTF8String(field)
        }

        if (getField("PRICE", globalState) !== undefined) {
            price = getField("PRICE", globalState).value.uint
        }

        if (getField("AVAILABLECARS", globalState) !== undefined) {
            avaiableCars = getField("AVAILABLECARS", globalState).value.uint
        }

        if (getField("SOLD", globalState) !== undefined) {
            sold = getField("SOLD", globalState).value.uint
        }

        return new Car(brand, image, description, location, price, avaiableCars, sold, appId, owner)
    } catch (err) {
        return null;
    }
}
