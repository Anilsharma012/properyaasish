import { getDatabase } from "../db/mongodb";
import { ObjectId } from "mongodb";

export const addBankTransferTestData = async () => {
  try {
    const db = getDatabase();

    // Check if test data already exists
    const existingTransfers = await db.collection("bank_transfers").countDocuments();
    
    if (existingTransfers > 0) {
      console.log(`📊 Bank transfers collection already has ${existingTransfers} records`);
      return;
    }

    console.log("📦 Adding test bank transfer data...");

    // Sample bank transfer data
    const sampleTransfers = [
      {
        userId: new ObjectId(),
        userName: "Rajesh Kumar",
        userEmail: "rajesh@example.com",
        userPhone: "9876543210",
        amount: 599,
        referenceNumber: "TXN123456789",
        bankName: "State Bank of India",
        accountHolderName: "Rajesh Kumar",
        transactionDate: new Date("2024-01-15T10:30:00Z"),
        status: "pending",
        proofDocument: "https://example.com/proof1.jpg",
        packageId: new ObjectId(),
        packageName: "Premium Listing Package",
        propertyId: new ObjectId(),
        propertyTitle: "3 BHK Apartment in Sector 12",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
      {
        userId: new ObjectId(),
        userName: "Priya Sharma",
        userEmail: "priya@example.com",
        userPhone: "9876543211",
        amount: 299,
        referenceNumber: "TXN123456790",
        bankName: "HDFC Bank",
        accountHolderName: "Priya Sharma",
        transactionDate: new Date("2024-01-14T15:45:00Z"),
        status: "verified",
        proofDocument: "https://example.com/proof2.jpg",
        verifiedBy: "Admin",
        verificationDate: new Date("2024-01-14T16:00:00Z"),
        remarks: "Transaction verified successfully",
        packageId: new ObjectId(),
        packageName: "Featured Listing Package",
        createdAt: new Date("2024-01-14T15:45:00Z"),
        updatedAt: new Date("2024-01-14T16:00:00Z"),
      },
      {
        userId: new ObjectId(),
        userName: "Amit Singh",
        userEmail: "amit@example.com",
        userPhone: "9876543212",
        amount: 199,
        referenceNumber: "TXN123456791",
        bankName: "ICICI Bank",
        accountHolderName: "Amit Singh",
        transactionDate: new Date("2024-01-13T09:20:00Z"),
        status: "rejected",
        proofDocument: "https://example.com/proof3.jpg",
        verifiedBy: "Admin",
        verificationDate: new Date("2024-01-13T11:00:00Z"),
        remarks: "Insufficient proof or invalid transaction",
        packageId: new ObjectId(),
        packageName: "Basic Listing Package",
        createdAt: new Date("2024-01-13T09:20:00Z"),
        updatedAt: new Date("2024-01-13T11:00:00Z"),
      },
      {
        userId: new ObjectId(),
        userName: "Sunita Devi",
        userEmail: "sunita@example.com",
        userPhone: "9876543213",
        amount: 999,
        referenceNumber: "TXN123456792",
        bankName: "Punjab National Bank",
        accountHolderName: "Sunita Devi",
        transactionDate: new Date("2024-01-12T14:10:00Z"),
        status: "pending",
        proofDocument: "https://example.com/proof4.jpg",
        packageId: new ObjectId(),
        packageName: "Premium Plus Package",
        propertyId: new ObjectId(),
        propertyTitle: "Independent House in Model Town",
        createdAt: new Date("2024-01-12T14:10:00Z"),
        updatedAt: new Date("2024-01-12T14:10:00Z"),
      },
      {
        userId: new ObjectId(),
        userName: "Rohit Verma",
        userEmail: "rohit@example.com",
        userPhone: "9876543214",
        amount: 399,
        referenceNumber: "TXN123456793",
        bankName: "Axis Bank",
        accountHolderName: "Rohit Verma",
        transactionDate: new Date("2024-01-16T11:20:00Z"),
        status: "verified",
        proofDocument: "https://example.com/proof5.jpg",
        verifiedBy: "Admin",
        verificationDate: new Date("2024-01-16T12:00:00Z"),
        remarks: "Payment confirmed and package activated",
        packageId: new ObjectId(),
        packageName: "Standard Package",
        createdAt: new Date("2024-01-16T11:20:00Z"),
        updatedAt: new Date("2024-01-16T12:00:00Z"),
      }
    ];

    // Insert test data
    const result = await db.collection("bank_transfers").insertMany(sampleTransfers);
    
    console.log(`✅ Added ${result.insertedCount} test bank transfers`);
    console.log("📊 Bank transfer test data added successfully!");

    return result;
  } catch (error) {
    console.error("❌ Error adding bank transfer test data:", error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addBankTransferTestData()
    .then(() => {
      console.log("✅ Bank transfer test data script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Bank transfer test data script failed:", error);
      process.exit(1);
    });
}
