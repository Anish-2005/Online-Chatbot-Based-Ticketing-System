import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useTheme } from '../pages/ThemeContext';

const PowerBIEmbedComponent = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`shadow-lg rounded-lg p-6 mb-6 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Cost and Time Analytics</h2>
      <PowerBIEmbed
        embedConfig={{
          type: 'report',   // Supported types: report, dashboard, tile, visual and qna
          id: '<your-report-id>',
          embedUrl: '<your-embed-url>',
          accessToken: '<your-access-token>',
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                visible: false
              },
              pageNavigation: {
                visible: true
              }
            }
          }
        }}
        cssClassName={"w-full h-96"}
      />
    </div>
  );
};

export default PowerBIEmbedComponent;
