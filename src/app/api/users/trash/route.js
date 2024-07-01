import { connect } from "@/config/dbConfig";
import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
import Trash from "@/modules/users/models/trashModel";
import Category from "@/modules/users/models/categoryModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect();

  try {
    const reqBody = await request.json();
    const { trashName, trashPrice, trashCategory, trashDescription, images } =
      reqBody;
    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

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
      trashCategory,
      trashDescription,
      images,
      user: userId,
    });

    await newTrash.save();

    return NextResponse.json({
      message: "Trash created successfully",
      success: true,
      trash: newTrash,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
