import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import oauth2Client from '@/lib/googleAuth';
import { connect } from '@/config/dbConfig';
import User from '@/modules/models/userModel';
import cookie from 'cookie';

export async function GET(req) {
  await connect();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const token = cookies.google_oauth_token;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Google OAuth token not found in cookies" },
      { status: 401 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    oauth2Client.setCredentials({ access_token: token });

    const people = google.people({ version: 'v1', auth: oauth2Client });
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });

    const profile = me.data;
    const photoUrl = profile.photos ? profile.photos[0].url : null;

    return NextResponse.json({ success: true, photoUrl });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
