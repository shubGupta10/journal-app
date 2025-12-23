export const dayMarkVerificationTemplate = (name: string, code: string) => {
    return `
    <div style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e5e7eb;">
        
        <h1 style="font-size: 22px; font-weight: 600; color: #111827; margin: 0;">
          Welcome to <span style="color: #4f46e5;">DayMark</span>, ${name}
        </h1>

        <p style="margin-top: 16px; font-size: 15px; color: #374151; line-height: 1.6;">
          This is a quiet space for daily writing and reflection.
          To continue, please confirm your email using the code below.
        </p>

        <div style="margin-top: 24px; padding: 18px; background-color: #f9fafb; border-radius: 8px; text-align: center; border: 1px dashed #e5e7eb;">
          <span style="font-size: 26px; font-weight: 600; color: #111827; letter-spacing: 4px;">
            ${code}
          </span>
        </div>

        <p style="margin-top: 24px; font-size: 14px; color: #4b5563;">
          Enter this code to verify your email.  
          The code expires in 10 minutes.
        </p>

        <p style="margin-top: 28px; font-size: 13px; color: #9ca3af;">
          If you didn’t request this, you can safely ignore this email.
          Your account will remain unchanged.
        </p>

        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
          DayMark is private by default. We don’t read your entries.
        </p>
      </div>
    </div>
  `;
};

export const dayMarkDailyReminderTemplate = (name?: string) => {
    return `
    <div style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e5e7eb;">
        
        <h1 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0;">
          A quiet reminder${name ? `, ${name}` : ""}
        </h1>

        <p style="margin-top: 16px; font-size: 15px; color: #374151; line-height: 1.6;">
          If you wanted to write today, this is your moment.
        </p>

        <p style="margin-top: 12px; font-size: 15px; color: #374151; line-height: 1.6;">
          A few honest lines are enough.  
          No pressure. No expectations.
        </p>

        <div style="margin-top: 24px;">
          <a 
            href="${process.env.APP_URL || "http://localhost:3000"}/entries/new"
            style="
              display: inline-block;
              padding: 12px 18px;
              background-color: #4f46e5;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
            "
          >
            Write now
          </a>
        </div>

        <p style="margin-top: 28px; font-size: 13px; color: #6b7280;">
          If today isn’t the day, that’s okay too.
          You can always pick it up tomorrow.
        </p>

        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
          You’re receiving this because daily reminders are enabled in DayMark.
          You can turn them off anytime in settings.
        </p>
      </div>
    </div>
  `;
};

