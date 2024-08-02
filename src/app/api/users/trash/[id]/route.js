import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Trash from "@/modules/models/trashModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect();

  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const trashes = await Trash.find({ user: userId }).populate(
      "trashCategory"
    );
    return NextResponse.json({
      success: true,
      trashes,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const {
      existTrashId: _id,
      trashName,
      trashPrice,
      trashCategory,
      trashDescription,
      images,
    } = reqBody;

    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Ambil data trash yang lama
    const oldTrashData = await Trash.findById(_id);

    if (!oldTrashData) {
      return NextResponse.json({ error: "Trash not found" }, { status: 404 });
    }

    const existingTrash = await Trash.findOne({
      $and: [
        { _id: { $ne: _id } }, // Dokumen yang ingin diupdate tidak termasuk dalam pencarian
        { user: userId },
        { trashName },
        { trashCategory },
      ],
    });

    if (existingTrash) {
      return NextResponse.json(
        { error: "Trash already Exists" },
        { status: 400 }
      );
    }

    // Siapkan perubahan
    const changes = {};

    // Cek perubahan nama
    if (oldTrashData.trashName !== trashName) {
      changes.trashName = oldTrashData.trashName;
    }

    // Cek perubahan harga
    if (oldTrashData.trashPrice !== trashPrice) {
      changes.trashPrice = oldTrashData.trashPrice;
    }

    // Cek perubahan kategori
    if (oldTrashData.trashCategory.toString() !== trashCategory) {
      changes.trashCategory = oldTrashData.trashCategory;
    }

    // Cek perubahan deskripsi
    if (oldTrashData.trashDescription !== trashDescription) {
      changes.trashDescription = oldTrashData.trashDescription;
    }

    const updateTrash = await Trash.findByIdAndUpdate(
      _id,
      {
        trashName,
        trashPrice,
        trashCategory,
        trashDescription,
        images,
        $push: {
          changeLogs: {
            modifiedBy: userId,
            changes,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      updateTrash,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
