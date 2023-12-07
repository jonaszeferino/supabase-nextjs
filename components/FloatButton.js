import { QuestionCircleOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { FloatButton as AntFloatButton, Button } from 'antd';

const FloatButton = () => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <>
      <AntFloatButton
        badge={{
          count: 12,
        }}
        icon={<QuestionCircleOutlined />}
      />

      {showInfo && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
          <p>Free Sign In - And Access the Evaluation of Movie Suggestions</p>
          <Button icon={<CloseOutlined />} onClick={toggleInfo}>
            Close
          </Button>
        </div>
      )}
    </>
  );
};

export default FloatButton;
