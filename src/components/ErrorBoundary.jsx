import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-red-500">Đã xảy ra lỗi!</h2>
          <p>{this.state.error?.toString()}</p>
          <p>Chi tiết: {this.state.errorInfo?.componentStack}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tải lại trang
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;