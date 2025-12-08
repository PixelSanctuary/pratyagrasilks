import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Insert contact message into database
        const { data, error } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name,
                    email,
                    subject,
                    message,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error inserting contact message:', error);
            return NextResponse.json(
                { error: 'Failed to submit contact message' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Contact message submitted successfully',
                data
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint for admins to retrieve contact messages
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();

        // Check if user is authenticated and is an admin
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const unreadOnly = searchParams.get('unread') === 'true';

        let query = supabase
            .from('contact_messages')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (unreadOnly) {
            query = query.eq('read', false);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching contact messages:', error);
            return NextResponse.json(
                { error: 'Failed to fetch contact messages' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
            count,
            limit,
            offset
        });
    } catch (error) {
        console.error('Error in GET /api/contact:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
