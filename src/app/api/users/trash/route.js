import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Trash from "@/modules/users/models/trashModel";
import Category from "@/modules/users/models/categoryModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  await connect();
  const { searchParams } = new URL(request.url);
  const isBulkUpload = searchParams.get("isBulkUpload") === "true";

  try {
    const reqBody = await request.json();
    const {
      trashName,
      trashPrice,
      trashCategory,
      trashDescription,
      images,
      createdAt,
    } = reqBody;
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    let trashCategoryId;

    // Periksa apakah trashCategory adalah ObjectId atau string nama kategori
    if (mongoose.Types.ObjectId.isValid(trashCategory)) {
      trashCategoryId = trashCategory;
    } else {
      const category = await Category.findOne({ user: userId, categoryName: trashCategory });
      if (!category) {
        return NextResponse.json(
          { error: `Category '${trashCategory}' not found` },
          { status: 404 }
        );
      }
      trashCategoryId = category._id;
    }

    if (isBulkUpload) {
      // Jika permintaan adalah bulk upload, lakukan update
      const replacedTrash = await Trash.findOneAndReplace(
        { trashName, user: userId },
        {
          trashName,
          trashPrice,
          trashCategory: trashCategoryId,
          trashDescription,
          images,
          createdAt: new Date(createdAt),
          user: userId,
        },
        { new: true, upsert: true }
      );

      return NextResponse.json({
        message: "Trash replaced successfully",
        success: true,
        trash: replacedTrash,
      });
    } else {
      // Check trash
      const trash = await Trash.findOne({ trashName, user: userId });
      if (trash) {
        return NextResponse.json(
          { error: "Trash already exists" },
          { status: 400 }
        );
      }

      const newTrash = new Trash({
        trashName,
        trashPrice,
        trashCategory: trashCategoryId,
        trashDescription,
        images,
        createdAt,
        user: userId,
      });

      await newTrash.save();

      return NextResponse.json({
        message: "Trash created successfully",
        success: true,
        trash: newTrash,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  await connect();

  try {
    // request.headers.get('authorization');
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 1000;

    const skip = (page - 1) * limit;

    const [trashes, totalTrashes] = await Promise.all([
      Trash.find({ user: userId })
        .populate("trashCategory")
        .skip(skip)
        .limit(limit),
      Trash.countDocuments({ user: userId }),
    ]);

    const totalPages = Math.ceil(totalTrashes / limit);

    return NextResponse.json({
      success: true,
      trashes,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connect();
  try {
    const userId = await getDataFromToken(request);
    const { trashId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!trashId) {
      return NextResponse.json(
        { error: "trashId is required" },
        { status: 400 }
      );
    }

    await Trash.deleteOne({ _id: trashId, user: userId });

    return NextResponse.json({
      success: true,
      message: "Trash deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
