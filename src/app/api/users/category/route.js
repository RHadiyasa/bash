import { connect } from "@/app/config/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connect(); // telepati sama database
  try {
    const reqBody = await request.json();
    const { categoryName } = reqBody;

    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check category
    const category = await Category.findOne({ categoryName, user: userId });
    if (category) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const newCategory = new Category({
      categoryName,
      user: userId,
    });

    await newCategory.save();

    return NextResponse.json({
      message: "Category created successfully",
      success: true,
      category: newCategory,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const { _id, categoryName } = reqBody;

    // Validasi input
    if (!_id || !categoryName) {
      return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
    }

    const userId = getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check category
    const existingCategory = await Category.findOne({
      _id,
      user: userId,
      categoryName,
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const updateCategory = await Category.updateOne(
      { _id, user: userId },
      { categoryName }
    );

    if (updateCategory.nModified === 0) {
      return NextResponse.json(
        { error: "Category not found or no changes made" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Category updated successfully",
      status: 200,
      existingCategory: updateCategory,
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

    const categories = await Category.find({ user: userId }).populate(
      "categoryName"
    );
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await getDataFromToken(request);
    const { categoryId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 }
      );
    }

    await Category.deleteOne({ _id: categoryId, user: userId });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
